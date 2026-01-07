---
title: "Thoughts on architecture"
date: "18/11/2025"
author: "Daniel Guedes"
description: "Reflections on software architecture, distributed systems, and the balance between monoliths and microservices."
coverImage: "architecture.svg"
---

Just recently, I have finished reading [designing data intensive applications](https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/) and thought to write something, both to organize my thoughts and also expose things related to my experience.

## Software Architecture and Code

Usually, when we speak about software development, there's a division between "code", algorithms, languages, frameworks, patterns, and architecture. I think most of the time this division can make sense, although in some parts the margin becomes blur, and its hard to distinguish between the two. An example of this is with certain design patterns in the code, broadly adopted in OOP languages such as Java, like the [adapter](https://refactoring.guru/design-patterns/adapter) pattern. 

When I think about architecture though, it always comes to mind distributed systems. Applications, data storages, cache systems. At this level code doesn't matter much, just systems and how they interact. Latency, throughput, MTTR are some of the metrics and the problems are race conditions, scaling and data consistence.

## Metrics

As humans, we tend to simplify and generalize things to ease our cognitive load. It's a good characteristic, but in some situations it can lead to bad paths. Thinking about using X tool instead of Y should be based on concrete analysis, instead of hunch, since the way a tool will behave depends on the information to which it is subject. That's where data, metrics come into play.

The book separates into three core metrics, commented bellow, however there are other authors and lists which include more specific metrics. Ex. from wikipedia [metrics](https://en.wikipedia.org/wiki/List_of_system_quality_attributes).

A note is that, even then these metrics are more subjective than objective. How to measure maintenability? You could probably track metrics such as time to recovery, number of bugs, refactors, etc. Some authors have done this, but I've never seen this applied in practice in any company.

### Reliability

I would summarize this as: **Does the system works consistently and correctly, and is resilient to possible issues?**

Some key thoughts to improve this are:

- Have good telemetry. Diverse ways to monitor functionality, and debug possible issues;
- Extensive testing through the whole stack. Manual testing included where applicable;
- Fast deployment and rollback process. Errors are quick to fix;
- Complete and working testing environments, clear and replicable ways to test before moving to production;
- Plan for redudancy, failover, redirection. Make it easy so that if a part of the system fails other parts don't.
- A/B tests and canary deployments. Minimize the blast radius, and rollout gradually.
- Make it easy to do the right thing. Doing things wrong should not be even possible. Ex. isolate DB access from only inside a VPN, prevent schema drops from user roles, etc.

Which leads to:

- A complex telemetry stack may arise along with your application, depending on how much data you need and want to track. You can track and manage this yourself (custom managed, perhaps prometheus based) or default to a service that provides this (nowdays newrelic, datadog, etc).
- A monolith limits failover capability a lot. Depends on the language and size of the project, but with a large project deployments will usually be long. Also there's no way to plan for systemic failover (for example the whole monolith going down). Thus the trend when uptime is critical is to break the system into smaller applications, *microservices*.

### Scalability

**How easy is to scale the system given demand? As the system grows, how performance behaves?**

And to improve this:

- Perform load tests early and in a comprehensive manner. Try to predict production behavior;
- Apply a mix of vertical and horizontal scaling when needed.
- Look for the bottleneck, and apply optimizations at the code level first before changing tools and scaling. Ex. in a read heavy browser client -> server -> database system, check if queries can be optimized, indexes added, cache applied, before scaling the database server.
- Take care of latency and tail metrics. In some types of systems, the users with the most data are the most valuable, and can have higher latency. Try to optimize where applicable
- Every order of magnitude of load applied to a system may call for a re-design of its internals to some extent. Ex. initially a postgreSQL DB with text-index may support text searches, but as load increases its better to split the system into a separated service for searches (ex. elastic search).

With the following implications:

- Making applications stateless will simplify scaling a lot.
- When applicable, use derived data to make it easier to scale stateful parts, and better fit specific need of the application. Vector DBs for text searches, memory / key value for caches and quickly rotating data with high performance, data stores for large analytics sets (snowflake, redshift, etc), and so on.

The usual phrase we hear is: start simple (monolith first) and microservices only when the need arrives. We hear the common opinion that: "a monolith solves 99% of X needs". I think as with all complex things, it depends. 

If you can extensively test, and to some extent predict the load, even with a low precision, like an order of magnitude, this may help narrow down if a certain type of system will fit the usage or not. For example, if you have a synchronous message queue service, and you detect straight away that latency is in the order of the milliseconds, this will tell you that with a few hundred concurrent users latency will break down, thus parallelization is crucial in this scenario.

### Maintenability

**How easy is it to maintain the system?**

- Make it easy to perform operations to maintain the system. No random SSH command with cryptic instructions, have clear runnable tasks.
- The system should be as simple as possible. Make it easy to understand
- Good documentation and clear runbooks on faults and failures
- Good abstractions. Custom services where applicable

Which has the following implications:

- Monoliths are good, self-contained and easy to understand, expand, deploy. Microservices add complexity which makes overall maintenance harder

## Review

Architecture is a quite complex topic, with no easy answers. Back on the early 2000s, the trend was for monoliths, with big systems as one codebase. Around 2010 up to 2020 it seems there was a big trend around microservices, with the dissemination of cloud services. Now it seems the trend is back with the monolithic services. 

Blindly following a trend can be seem as trying to build a house on a clay soil. Just because the first layer is solid, doesn't mean things bellow are as well. Testing for real scenarios very early can help a lot on this aspect. Then it becomes a matter of fitting for the projects needs. 

Bellow are some topics related to data and applications:

| Topic      | Tool               | Scenario                                         | Examples                           |
|------------|--------------------|--------------------------------------------------|-------------------------------------|
| Cache      | Centralized cache  | Read-heavy. Centralized cache                    | Redis, memcache                     |
| Cache      | In memory cache    | Non-centralized, faster than redis               | -                                   |
| Cache      | CDN                | Low latency for static assets.                   | Cloudfront, Cloudflare, Cloud CDN   |
| Analytics  | Data store         | Complex joins. Large datasets                    | Redshift, Snowflake                 |
| Analytics  | Log platform       | Complex user metrics. Custom observability       | Prometheus, New Relic               |
| Text search| Vector database    | Ranked documents. Complex usecase                | Elasticsearch, OpenSearch           |
| Database   | SQL                | ACID compliance. Reliable, all around            | Postgres, MySQL                     |
| Database   | Cassandra          | Write-heavy. High throughput                     | -                                   |
| Database   | Document           | Read-heavy. High throughput                      | DynamoDB, MongoDB                   |
| Database   | Key-value          | Key value store. Low latency. In memory but persistent | Redis                          |
| Database   | Blob storage       | Large object storage                             | S3, GCS                             |
| Event      | Log stream         | High throughput, async, continuous.              | Kafka, Kinesis                      |
| Event      | MQ                 | Consistent. Retries                              | SQS, RabbitMQ                       |
| Batch      | Job runner         | Async. Periodic. Simpler than stream             | -                                   |


This is an overview for things usually related to scalability and reliability, other topics missing are:

- Load balancers
- Security
- CI/CD
etc