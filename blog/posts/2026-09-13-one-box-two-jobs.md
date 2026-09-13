---
title: One Box, Two Jobs: Self-Hosting on the GPU AI Lab
date: 2026-09-13
excerpt: The same bare-metal RTX 4090 box that runs my AI inference lab also runs a full self-hosted services stack and an observability layer that watches the GPU itself. Here is how it fits together.
tags: Homelab, Self-Hosting, Observability, NVIDIA, Docker
---

The bare-metal Ubuntu workstation behind my [GPU AI Inference Lab](/blog/gpu-ai-inference-lab.html) does not sit idle between experiments. The same box (RTX 4090, i9, 32 GB) also runs a full self-hosted services stack and an observability layer that watches everything, including the GPU. It is a learning environment, not production and not a copy of one, but it is built with the same discipline I bring to production work: network isolation, hardened access, and full visibility into every layer.

Here is what is actually running, and why each piece is there.

## A self-hosted stack, wired like real infrastructure

The user-facing service is a Jellyfin media server, but the interesting part is everything around it. A set of containers work together, and each choice mirrors something that matters in a real environment:

- **Reverse proxy and remote access:** Nginx Proxy Manager terminates and routes traffic internally, and a Cloudflare tunnel exposes only what I choose, with no inbound ports opened on my network.
- **Hardened Docker access:** the containers that need to see Docker talk to a socket proxy, not the raw Docker socket. That one choice shrinks the blast radius if any single container is compromised.

None of this is exotic, and that is the point. It is the same set of moves that matter anywhere: front services with a proxy, avoid open inbound ports, and never hand a container more privilege than it needs.

## Observability, from the node up to the GPU

You cannot operate what you cannot see, so the box runs its own monitoring stack:

- **node-exporter** for host metrics (CPU, memory, disk, network).
- **cAdvisor** for per-container metrics across every service above.
- **NVIDIA DCGM** for live GPU telemetry: utilization, memory, power, and temperature.
- **Prometheus** scraping all three, with **Grafana** dashboards on top.

The GPU telemetry is where the two jobs meet. When the AI lab is serving a model, I can watch the 4090 work in real time on the same dashboards that track the rest of the host. That is the observability layer used to run GPU fleets, running on one workstation, and it is teaching me the metrics that matter before I ever need them at scale.

## Why run it all on one box

Consolidating onto a single machine forces the tradeoffs to be real. Resource contention, network segmentation, and access control all have to be handled deliberately when the media stack, the observability stack, and the GPU inference work share the same hardware. That is a better teacher than spreading everything across isolated VMs where nothing ever competes.

There is a fitting detail to close on. I am writing and shipping this very site from that same box: edit, commit, and push to GitHub, and Azure Static Web Apps rebuilds and deploys in about a minute. The machine that runs my AI lab and my homelab is also the one that publishes the site you are reading this on.

More to come as the AI-serving layer matures, with concrete numbers once they are worth posting.
