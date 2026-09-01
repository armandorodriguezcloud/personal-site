---
title: Building a GPU AI Inference Lab
date: 2026-06-25
excerpt: Assembling a self-hosted AI inference stack from the driver up: CUDA, GPU containers, DCGM telemetry, Triton/NIM serving, and Kubernetes GPU scheduling.
tags: Edge AI, NVIDIA, GPU, Homelab
---

I'm building a self-hosted AI inference lab on a bare-metal Ubuntu workstation (RTX 4090, i9, 32 GB RAM) to get hands-on with the infrastructure that runs modern AI in production: the layer beneath the models, where the real operational work lives.

Rather than renting a managed endpoint, I'm assembling the full stack from the driver up, so I understand every layer the way I understand cloud infrastructure today.

## The stack

- **GPU compute foundation:** the NVIDIA driver and CUDA installed natively on Linux and verified end to end, so the GPU is a first-class, observable resource rather than a black box.
- **GPU-accelerated containers:** the NVIDIA Container Toolkit, exposing the GPU into Docker so workloads are portable and reproducible.
- **Real-time telemetry:** NVIDIA DCGM (Data Center GPU Manager) streaming live utilization, memory, power, and thermal metrics, the same observability layer used to run GPU fleets.
- **Model serving:** an NVIDIA NIM (Inference Microservice) pulled from NGC and served through Triton Inference Server, standing up a production-style, API-driven inference endpoint.
- **Orchestration:** a Kubernetes cluster with GPU scheduling, so inference workloads are placed and managed the way they are at scale.

## Why I'm building it

I've spent about twelve years in cloud and infrastructure engineering: Azure, virtualization, networking, and secure, regulated environments. AI infrastructure is the same discipline (provisioning, observability, orchestration, security) applied to GPUs. This lab is where I turn that transfer from conceptual, as an NCA-AIIO certified engineer, into operational, hands-on skill.

## What it demonstrates

Designing, provisioning, and operating GPU infrastructure end to end: from driver and CUDA validation, through containerization and telemetry, to model serving and Kubernetes orchestration, with the observability and reproducibility discipline of production cloud engineering.

I'll post updates here as each layer lands, with the concrete results (validated driver and CUDA versions, live metrics, and serving benchmarks) as they come in.
