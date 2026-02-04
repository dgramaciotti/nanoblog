---
title: "What is the speed of a computer?"
date: "04/02/2026"
author: "Daniel Guedes"
description: "A comparison of speeds of common operations in software systems."
coverImage: "speed.svg"
---

For some time I've been thinking about writing about time in the world of applications. Doing the research to write this, I've found there is already some very good material out there around the topic, such as the [Systems Performance Enterprise and the Cloud](https://www.brendangregg.com/blog/2020-07-15/systems-performance-2nd-edition.html) book, which also covers many other things.

The idea is to expand a bit on the topic, give some insight into optimizations for each level and also talk about current LLM AI models, a new module in many systems.

## Index

1. The scale
2. Nano
3. Micro
4. Mili
5. Second
6. Table
7. Gotchas

## 1 - The scale

Just in case you are not familiar with the engineering notation, bellow is a reference on the units:

```
nano = 10-9 = 0.000000001 s
microseconds = 10-6 =  0.000001 s
milliseconds = 10-3 =  0.001 s 
seconds = 10^0 = 1 s
```

To give some perspective, if we revert things to the other side of the scale, 10^9 seconds it's aproximately 32 years. In 1 nanosecond, light travels around 30 cm. It's an abismaly small timescale. Yet computers do elemental actions at this speed. It makes sense, given the clock rate of modern CPUs is in the GHz. A computer process things sequentialy, so at a single CPU things can't be faster than the clock rate.

## 2 -  Nano

This is the quickest we have today. Compiled languages like Rust, C, Assembly can operate simple operations at the scale of nanoseconds. Operations like: In memory access to variables, the L1 CPU cache, simple math. This is the limit of what the current computer architecture can do. Throughout the article I'll use some code snippets you can copy and paste, test yourself to see the results. Bellow is the first one.

This code does a simple variable assignment, and uses the time library to track it.

C code:

```c
#include <stdio.h>
#include <time.h>

int main() {
    struct timespec start, end;
    int target = 0;
    int iterations = 100000;

    clock_gettime(CLOCK_MONOTONIC, &start);

    // Looping to get the average
    for (int i = 0; i < iterations; i++) {
        target = i;
    }

    clock_gettime(CLOCK_MONOTONIC, &end);

    long seconds = end.tv_sec - start.tv_sec;
    long nanoseconds = end.tv_nsec - start.tv_nsec;
    double total_ns = (double)seconds * 1e9 + nanoseconds;

    printf("Total: %.0f ns\n", total_ns);
    printf("Average per op: %.2f ns\n", total_ns / iterations);

    return 0;
}
```

And the output for me:

```sh
% gcc code/speed.c -o main && ./main                                                          
Total: 94000 ns
Average per op: 0.94 ns
```

C is quite quick. Probably as quick as it gets for general usage. You should get consistently nano seconds numbers on a modern machine. The machine used for these tests is an apple M1, with 3.2GHz. So each clock tick is 0.3ns.

Let's see the same idea, but with Golang:

```golang
package main

import (
	"fmt"
	"time"
)

func main() {
	iterations := 100000
	var sink int
	t := time.Now()
	for i := 0; i < iterations; i++ {
		sink = i
	}
	elapsed := time.Since(t)
	// Pass a value so the compiler does not complain
	sink++

	nsTotal := float64(elapsed.Nanoseconds())
	fmt.Printf("Total time: %v\n", elapsed)
	fmt.Printf("Average per op: %.4f ns\n", nsTotal/float64(iterations))
}

```

Which gives for me:

```sh
% go run code/speed.go
Total time: 37.083µs
Average per op: 0.3708 ns
```

First question is: What the hell, how golang is faster than C? Well, the compiler is making it faster. Even though we do a loop, and assignment, the compiler sees that only the final value of the sink variable is being used. So it still goes through the loop, but only does a single assignment, after the whole loop is through. That's why the average is basically at clock speed.

To "fix" that, you have to actually use the variable. Or otherwise do some "compiler" magic:

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	iterations := 100000
	t := time.Now()
	sink := 0
	for i := 0; i < iterations; i++ {
		// Doing some sum operation
		sink = sink + i + 10
	}
	fmt.Printf("%d\n", sink)
	elapsed := time.Since(t)

	nsTotal := float64(elapsed.Nanoseconds())
	fmt.Printf("Total time: %v\n", elapsed)
	fmt.Printf("Average per op: %.4f ns\n", nsTotal/float64(iterations))
}
```

Which should give something more sensible:

```sh
± % go run main.go
5000950000
Total time: 78.375µs
Average per op: 0.7837 ns
```

Finally, can something like javascript or Python even compete against these compiled languages?

Let's seeJavascript:

```Javascript
(function() {
    const iterations = 100000;
    let sum = 0;

    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
        sum += i;
    }

    const end = performance.now();
    const totalMs = end - start;
    const totalNs = totalMs * 1e6; // Convert ms to ns

    console.log(`Total time: ${totalMs.toFixed(4)} ms`);
    console.log(`Average per op: ${(totalNs / iterations).toFixed(4)} ns`);
    console.log(`Final Sum: ${sum}`); // Print sum so the engine doesn't delete the loop
})();
```

Which running on a Chrome (v8) browser window, gives:

```sh
Total time: 1.0000 ms
Average per op: 10.0000 ns
Final Sum: 4999950000
```

Notice that's still quite fast. Still within nanoseconds. Well, javascript can be fast. Specially if the JIT compiler is optimized, operations are simple. So, to sum things up:

- To make a nanosecond operation faster, you better know very well how your compiler works.
- Better know very well the fundamentals of how things run in a CPU (L1 cache, memory assignment, Random memory access). For example, what's the OS overhead, difference between a regular OS and a RTOS, etc.
- Solid understanding of whatever language is under use, and how exactly operations are done, how assembly works and how your machine may execute things. What's the runtime, the compiler?

All of that for **nanoseconds**. So what does it matter?

Compare this situation: 

- A `n * log (n)` Loop over a thousand elements followed by
- A single measly blocking network call

What does it matter if you do the loop 1 time, 100 or even 1000 times? It will execute in under a millisecond. If you however right after that do a blocking network call... a single call will usually take hundreds of milliseconds, at a minimum, if it's across the internet.

On the other hand, if you're sorting a [few billion rows](https://github.com/gunnarmorling/1brc).... A billion is a big number. Its 10^9. In practice, if you were running at clock speed, it would take at the very least 1 second to go through everything. [Of course](https://en.wikipedia.org/wiki/Superscalar_processor), [it's not that simple](https://en.wikipedia.org/wiki/Single_instruction,_multiple_data). But you get the general idea. 

For a more mathematical approach to this argument, we have [Amdahl's law](https://en.wikipedia.org/wiki/Amdahl%27s_law). Basically, know what's the impact on what you're optimizing, before you optimize it.

## 3 - Micro

Doing 1000 nanosecond operations, you get into the microsecond scale. Loops over up a few thousands of items, UNIX Sockets, garbage collectors, OS "jitters", all will be in this order. Redis is usually in the order of a few microseconds (internally) + the correspondent "transport" layer overhead (Local TCP, in mem, etc).

Reading from disk for example, will at a minimum take tens of microseconds (if you hit the disk cache), in practice for SSDs usually takes hundreds of microseconds. Hard drives are way slower, because of physics (the disk has to spin the magnetic neddle).

I'll not use `C` anymore, instead keeping it to golang. Bellow is some code which does some read/write on a local redis instance, and a OS read file operation:

```go
package main

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/redis/go-redis/v9"
)

func main() {
	ctx := context.Background()

	// Redis already running (on brew)
	rdb := redis.NewClient(&redis.Options{Addr: "localhost:6379"})

	// Warm the connection
	rdb.Ping(ctx)

	start := time.Now()
	rdb.Set(ctx, "key", "value", 0)
	rdb.Get(ctx, "key")
	fmt.Printf("Redis (Warmed): %v\n", time.Since(start))

	// check a disk read
	filename := "test.txt"
	os.WriteFile(filename, []byte("some data"), 0644)
	defer os.Remove(filename)

	start = time.Now()
	os.ReadFile(filename)
	fmt.Printf("Disk Read: %v\n", time.Since(start))
}
```

Which yielded, after a few calls around:

```sh
% go run main.go                                                                                            
Redis (Warmed): 320.75µs
Disk Read: 17.084µs
```

Notice that the Redis call still took 300µ ~, which is mostly the TCP overhead mentioned. The Disk read took only a few microseconds, due to cached reads from the OS.

At this scale, the optimizations go from "brushing bits" to properly doing network routing, optimizing protocols, using systems that leverage memory access, cache, etc. The layers between simple operations begin to show as the software is being built in a complex layer of abstraction to simplify existing architectures. For example, in networking, a structured TCP call has at the very minimum a SYN + SYN-ACK + ACK calls, which will take on a LAN a few milliseconds. A local UDP fire will take microseconds.

In most web systems, optmizations at the nanosecond and microsecond levels don't tend matter much. However in very large, specially microsystem based architectures, microsecond operations start to stack up, and the latencies show. So for the micro scale:

- You'll have to understand the OS you're using very well to optimize these.
- Changing from network calls, to simpler protocols, or in memory, threads / shared processes is the difference between having microsecond calls to milliseconds.

## 4 - Mili

1000 microsecond operations. Most "high-level" things will be on this scale. I like to think it's the realm of web applications, although a usual frame rate of 60 FPS (1/60 = 16 ms) is in the scale too. Here we have:

- Database calls,
	- Local calls over TCP may take < 5ms
	- simple queries with indexes on rows with up to a few million rows (O(n)), will take usually less than 10 ms.
- same datacenter communication
- operations on very large lists (millions of elements)
- TCP, HTTP, Web calls
	- Across regions (ex. europe -> america) will take at the very least around 100 ms, `latency` is the word.

LLMs, are currently at this scale. Usually for fast LLM models (in large machines, with large GPUs) the time per output token (time per word, more or less) is around 10-50 ms. Of course this can vary a lot, with larger models taking longer. Also, this does not directly map to the "output" time. For example "thiking" models will have a lot more internal loops of generating their own context, so they will take way longer. They're generating more tokens to enrich their internal context. 

Overall, this processing time maps very well to the fact that GPUs are being orchestrated to perform billions of rows x columns matrix operations. This means things have to go from the RAM to the GPUs. So memory transfer time and syncronization (since models take hundreds of GBs) are the current bottlenecks. 

It's still a greenfield area, so a lot of changes can occour in a short amount of time. A few years ago, GPUs where not a term used along in distributed computing. These days it seems every week there's some news about a [data center with GW comsumptions](https://www.cnbc.com/2025/09/23/openai-first-data-center-in-500-billion-stargate-project-up-in-texas.html). Tons of RAM and Tons of GPUs.

At this scale, the speed of light starts to become very noticeable. A network call between "neighboring" regions (US-EAST -> SAO PAULO , US-EAST -> GERMANY) will take hundreds of milliseconds, even in a best case scenario, simply because light has to travel the distance, and do that for a few round trips required in the TCP + TLS stack.

Golang code:

```go
package main

import (
	"database/sql"
	"fmt"
	"math/rand"
	"net/http"
	"os"
	"slices"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	sortLargeList()
	dbOperation()
}

func sortLargeList() {
	data := make([]int, 1_000_000)
	for i := range data {
		data[i] = rand.Intn(1_000_000)
	}

	start := time.Now()
	slices.Sort(data)
	elapsed := time.Since(start)

	fmt.Printf("Sort 1M ints: %v\n", elapsed)
}

func dbOperation() {
	db, _ := sql.Open("sqlite3", ":memory:")
	db.Exec("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)")
	db.Exec("INSERT INTO users (name) VALUES ('Some random value')")

	http.HandleFunc("/user", func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		var name string
		db.QueryRow("SELECT name FROM users WHERE id = 1").Scan(&name)

		elapsed := time.Since(start)
		fmt.Printf("DB query took: %v\n", elapsed)
		w.Write([]byte(name))
	})

	go http.ListenAndServe(":8080", nil)
	time.Sleep(100 * time.Millisecond)

	startReq := time.Now()
	http.Get("http://localhost:8080/user")
	fmt.Printf("Total Web + DB Roundtrip: %v\n", time.Since(startReq))
}
```

which yields:

```sh
go run main.go
Sort 1M ints: 88.28825ms
DB query took: 60.958µs
Total Web + DB Roundtrip: 2.38075ms
```

Notice that the query itself doesn't take long, after all it's an "empty" table. The TCP overhead takes most of the time. On the contrary of microseconds and nanoseconds optimizations, which tend to be more rare, millisecond optimizations are gold when possible. To optimize at this level:

- Networking is key. Data has to move between points. How is it being orchestrated to move matters (TCP/UDP, QUIC, MQTT, HTTP, etc).
- Algorithm complexity will scale quickly. Here, a array is being sorted, but what do you think your database will try to do when you search for an item without an index?

## 5 - Seconds

Now we're at the "human" level. Thousands of milliseconds operations. Operating on data based on network calls, complex queries, such as joins. Jobs, or multiple database operations, network calls. If a site takes more than a few seconds to load a user will get upset.

Bellow is an example call to a news site in vietnam from here in Brazil:

```sh
% curl -s -o /dev/null -w "Total Time: %{time_total}s\n" http://www.chinhphu.vn/                                                                                                                 
Total Time: 1.901552s
```

## 6 - Table

So, to sum things up:

| Operation | Estimated Scale | Real-world Time (approx.) |
| :--- | :--- | :--- |
| **Simple instructions** | Nano | 0.3 ns - 1 ns |
| **Javascript loop iteration (JIT)** | Nano | 10 ns |
| **Redis local + transport** | Micro | 100 µs - 200 µs |
| **Reading from an SSD** | Micro | 100 µs - 1000 µs |
| **Local Network Loopback (TCP/IP)** | Mili | 1 ms - 5 ms |
| **Local Database Query (Indexed)** | Mili | 1 ms - 10 ms |
| **LLM Token Generation (Fast model)** | Mili | 10 ms - 50 ms |
| **Same Datacenter TCP (AWS VPC)** | Mili | 0.5 ms - 2 ms |
| **Cross-continent Network (US to EU)** | Mili | 80 ms - 150 ms |
| **Complex SQL Query / Large Sort** | Second | 1 s - 5 s |

## 7 - Gotchas

These are some observations from my experience with the web:

- When building your infrastructure for efficiency, try to target same datacenter, local networks. Providers such as AWS allow this in a simple way through VPCs, for example. Do your networking homework; Ex. Put your lambdas, ec2, etc in the same network group as the DB. Reduces the internal latency drastically.

- Optimizations are very tricky, specially considering the weight of operations. Does it matter doing a search in an unordered list of 1000 items, when right after that there's a file read and write? The read and write takes order of magnitude more time. At the same time, try reading a million rows without an index, and the algorithm complexity will show itself.

- Proper tracing and logging are worth gold when well positioned. These will show where the problem is, and help guide where is the issue. 

- Some languages can have some overhead by the simple fact of runtime or compiler architecture. Running garbage collectors, managing, etc will take time. But be wary: context is key here. If your network latency is slow, or the DB latency is slow, the language speed will usually be swamped by these factors. Also, runtime context is key. [Lua](https://www.lua.org/) is known for being quite slow. [LuaJIT](https://luajit.org/), used in OpenResty is [quite fast](https://staff.fnwi.uva.nl/h.vandermeer/docs/lua/luajit/luajit_performance.html).

- Beyond the web stack, for example with games, or massive data processing, the shift is much bigger towards efficiency and control, simply because of the number of operations. Rendering graphics will take thousands, millions of mathematical operations in a second. In this scenario optimizations are far more common.

- In systems such as web commerce, tail latency can throw all assumptions away. A network call takes a maximum of 200ms? Think again. A user with a particurlarly large set of items, a combination of a GC call, unpredictabilities, and time for a page load can take many seconds, even timing out. Timings are not written in stone. Complexity tends to pile up, and [weird things do happen](https://www.youtube.com/watch?v=tDacjrSCeq4).

## References

* <https://static.googleusercontent.com/media/sre.google/en//static/pdf/rule-of-thumb-latency-numbers-letter.pdf>
* https://en.wikipedia.org/wiki/Clock_rate
* <https://colin-scott.github.io/personal_website/research/interactive_latency.html>
* <https://thundergolfer.com/latency-numbers>
* <https://aws.amazon.com/what-is/latency/>
* <https://web.dev/articles/rail>
* <https://www.researchgate.net/publication/385118199_A_Performance_Benchmark_for_the_PostgreSQL_and_MySQL_Databases>
* <https://arxiv.org/html/2507.14397v1>
* <https://ece.gatech.edu/news/2023/12/silicon-germanium-chip-sets-new-speed-record>
* <https://pubmed.ncbi.nlm.nih.gov/35338120/>
* <https://www.youtube.com/watch?v=IxkSlnrRFqc>
* https://www.youtube.com/watch?v=phbaxNPJxss
* <https://en.wikipedia.org/wiki/Amdahl%27s_law>
* https://www.brendangregg.com/blog/2021-09-26/the-speed-of-time.html
* Systems Performance: Enterprise and the Cloud, 2nd Edition (2020) - Brendan Gregg
