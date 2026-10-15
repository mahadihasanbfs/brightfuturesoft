import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
      HiChevronRight, 
      HiChevronDown, 
      HiCheckCircle, 
      HiCheck, 
      HiCalendarDays, 
      HiClock, 
      HiShieldCheck, 
      HiCodeBracket, 
      HiArrowSmallRight 
} from "react-icons/hi2";

import { base_url } from "../../../layout/Title";
import { CallSchedule } from "../../../pages/shared/Header/Header";
import moduleName from "../../../Assctes/logo.png";

// Service Vector Illustrations
import ui from "../../../Assctes/vectors/ui.gif";
import web from "../../../Assctes/vectors/web.gif";
import app from "../../../Assctes/vectors/app.gif";
import it_consulting from "../../../Assctes/vectors/IT Consulting.gif";
import custom_software_development from "../../../Assctes/vectors/Custom Software Development.gif";
import data_analytics from "../../../Assctes/vectors/animated Data Analytics.gif";
import DevOps from "../../../Assctes/vectors/DevOps.gif";
import support from "../../../Assctes/vectors/Support And Maintenance.gif";
import e_commerce from "../../../Assctes/vectors/E-commerce.gif";
import erp from "../../../Assctes/vectors/ERP Systems.gif";
import legacy from "../../../Assctes/vectors/Legacy System Modernization.gif";
import crm from "../../../Assctes/vectors/CRM.gif";

const serviceInfo = [
            {
                  id: "ui-ux-design",
                  url: "ui-ux-design",
                  name: "UI/UX Design & Prototyping",
                  category: "Product Design & Strategy",
                  pic: ui,
                  tagline: "Design systems and human-centric interfaces built for rapid adoption and engagement.",
                  description: "We provide comprehensive UI/UX design services for complex enterprise software, SaaS platforms, high-conversion websites, and executive dashboards. Every screen is engineered in Figma with scalable design tokens, WCAG 2.1 AA accessibility, and click-through interactive prototypes.",
                  overview: "Great software starts with intuitive user experiences that minimize friction and maximize productivity. Our design practice combines quantitative user behavior analysis with rigorous design systems engineering. We deliver high-fidelity component libraries and interactive prototypes that accelerate frontend development and eliminate expensive redesigns.",
                  specs: {
                        engagement: "Product Squad or Dedicated Designer",
                        velocity: "Weekly Design Reviews & Prototypes",
                        ownership: "100% Client-Owned Figma Files",
                        sla: "Full Component Documentation & Support"
                  },
                  features: [
                        {
                              title: "Scalable Figma Design Systems",
                              description: "We construct modular, tokenized Figma libraries with atomic components, fluid typography, and dark/light color palettes ready for direct frontend handoff.",
                              deliverable: "Complete Figma design library & tokens"
                        },
                        {
                              title: "User Research & Journey Mapping",
                              description: "Our team maps user personas, qualitative behavioral flows, and task hierarchies to streamline complex workflows and eliminate user friction.",
                              deliverable: "UX research report & interactive wireframes"
                        },
                        {
                              title: "High-Fidelity Clickable Prototyping",
                              description: "Interactive prototypes that simulate micro-interactions, page state transitions, and conditional logic for stakeholder validation before coding.",
                              deliverable: "Shareable Figma clickable prototype"
                        },
                        {
                              title: "Accessibility & Usability Audits",
                              description: "We evaluate contrast ratios, focus states, and keyboard navigation to ensure strict compliance with international WCAG 2.1 AA accessibility standards.",
                              deliverable: "WCAG 2.1 AA compliance certification"
                        }
                  ],
                  techStack: ["Figma", "Design Tokens", "Adobe XD", "Sketch", "Storybook", "UserTesting", "FigJam", "Tailwind Design"],
                  questions: [
                        {
                              question: "How do you ensure UI/UX designs are genuinely user-friendly?",
                              answer: "We perform iterative user testing, heuristic evaluations, and stakeholder interviews. We test wireframes with actual end-users to measure task completion speed and confusion points before writing a single line of production code."
                        },
                        {
                              question: "What deliverable files do we receive after design completion?",
                              answer: "You receive full, unrestricted ownership of our Figma source files, including auto-layout components, color/typography design tokens, responsive breakpoints (Desktop, Tablet, Mobile), exportable SVG assets, and developer handoff documentation."
                        },
                        {
                              question: "Can you redesign or modernize an existing legacy software interface?",
                              answer: "Yes. We frequently audit and redesign legacy enterprise portals and ERPs to modernize their visual design, optimize multi-step workflows, and convert them into responsive, modern web standards."
                        },
                        {
                              question: "How do your designers collaborate with our engineering team?",
                              answer: "Our designers work hand-in-hand with frontend engineers, providing precise Storybook component specs, CSS layout guidelines, interaction states (hover, active, disabled), and asset exports for seamless implementation."
                        }
                  ],
                  related: ["web-development", "app-development", "custom-software-development"]
            },
            {
                  id: "web-development",
                  url: "web-development",
                  name: "Web Application Development",
                  category: "Frontend & Full-Stack",
                  pic: web,
                  tagline: "High-performance, secure, and SEO-optimized web apps engineered for scale.",
                  description: "From mission-critical SaaS platforms to high-concurrency enterprise web portals, we architect and develop scalable web applications utilizing React, Next.js, Node.js, and TypeScript with sub-second page performance.",
                  overview: "Modern web applications demand lightning-fast load times, flawless responsiveness across viewports, robust API integration, and enterprise-grade security. Bright Future Soft engineers full-stack web platforms using battle-tested microservice and modular architectures, complete with automated CI/CD and automated test coverage.",
                  specs: {
                        engagement: "Dedicated Scrum Squad or Full-Stack Engineers",
                        velocity: "2-Week Agile Sprints with Staging Demos",
                        ownership: "100% Client-Owned Git Repositories",
                        sla: "99.9% Uptime Support & Rapid Patching"
                  },
                  features: [
                        {
                              title: "Next.js & React Frontend Architecture",
                              description: "Server-side rendering (SSR), incremental static regeneration (ISR), and modular component design for unparalleled speed and SEO dominance.",
                              deliverable: "Production Next.js / React application codebase"
                        },
                        {
                              title: "Resilient Microservices & REST/GraphQL APIs",
                              description: "Distributed backends engineered in Node.js, Go, or Python with secure JWT/OAuth2 authentication, rate limiting, and database connection pooling.",
                              deliverable: "Swagger / OpenAPI documented endpoints"
                        },
                        {
                              title: "Database Optimization & High Concurrency",
                              description: "Relational (PostgreSQL) and NoSQL (MongoDB, Redis) databases tuned with indexing, read replicas, and caching for ultra-low latency queries.",
                              deliverable: "Optimized schemas & migration scripts"
                        },
                        {
                              title: "Enterprise Security & OWASP Defense",
                              description: "Hardened security protocols protecting against XSS, CSRF, SQL injection, and DDoS attacks with encrypted data-at-rest and in-transit.",
                              deliverable: "Security audit report & hardened headers"
                        }
                  ],
                  techStack: ["React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS", "PostgreSQL", "MongoDB", "Redis", "Docker", "GraphQL"],
                  questions: [
                        {
                              question: "How do you ensure our web application achieves top SEO rankings?",
                              answer: "We engineer Next.js server-side rendered (SSR) markup, structured Schema.org JSON-LD data, automated XML sitemaps, clean semantic HTML5, and sub-second Core Web Vitals (LCP, FID, CLS) that search engines prioritize."
                        },
                        {
                              question: "Can you integrate custom third-party APIs and payment processors?",
                              answer: "Yes. We regularly integrate payment gateways (Stripe, SSLCommerz, bKash, PayPal), CRM systems (Salesforce, HubSpot), ERPs, and cloud storage providers with automated retry logic and webhook event listeners."
                        },
                        {
                              question: "Do we have complete access to the code during development?",
                              answer: "Absolutely. You receive full access to our private Git repository (GitHub/GitLab) with real-time commit logs, pull request reviews, and continuous deployments to an accessible staging server."
                        },
                        {
                              question: "What maintenance and SLA guarantees do you provide post-launch?",
                              answer: "We provide comprehensive post-launch warranty support, continuous security patching, dependency upgrades, 24/7 server health monitoring, and guaranteed response SLAs for critical hotfixes."
                        }
                  ],
                  related: ["ui-ux-design", "app-development", "devops-ci-cd"]
            },
            {
                  id: "app-development",
                  url: "app-development",
                  name: "Mobile App Development",
                  category: "iOS & Android Multiplatform",
                  pic: app,
                  tagline: "Native and cross-platform mobile apps delivering fluid 60fps user experiences.",
                  description: "We engineer native and cross-platform mobile applications for iOS and Android using Flutter and React Native. Our apps combine native device hardware integration, offline caching, and frictionless UX.",
                  overview: "In a mobile-first world, your application must operate smoothly across thousands of distinct device models, operating system versions, and screen densities. Bright Future Soft builds secure, scalable mobile applications with clean architecture, offline-first data sync, and seamless App Store / Play Store deployment.",
                  specs: {
                        engagement: "Cross-Platform Mobile Squad",
                        velocity: "Bi-Weekly TestFlight & APK Builds",
                        ownership: "100% Client-Owned Source & Store Accounts",
                        sla: "OS Upgrade & Store Compliance Support"
                  },
                  features: [
                        {
                              title: "Flutter & React Native Cross-Platform",
                              description: "A single, highly optimized codebase powering fluid 60fps applications across both Apple iOS and Google Android, dramatically cutting time-to-market.",
                              deliverable: "Native iOS & Android compilation artifacts"
                        },
                        {
                              title: "Offline-First Data Synchronization",
                              description: "Local storage persistence with SQLite/Hive allowing users to operate uninterrupted without internet access, synchronizing automatically upon reconnection.",
                              deliverable: "Resilient offline caching engine"
                        },
                        {
                              title: "Hardware & Native Sensor Integration",
                              description: "Direct integration with biometric FaceID/fingerprint sensors, GPS geolocation, cameras, Bluetooth peripherals, and background push notifications.",
                              deliverable: "Native device plugin configurations"
                        },
                        {
                              title: "App Store & Play Store Certification",
                              description: "End-to-end guidance through Apple Developer and Google Play Console submission, privacy declarations, asset generation, and review approvals.",
                              deliverable: "Live published App Store & Play Store apps"
                        }
                  ],
                  techStack: ["Flutter", "Dart", "React Native", "Swift", "Kotlin", "Firebase", "SQLite", "GraphQL", "Fastlane", "Push Notifications"],
                  questions: [
                        {
                              question: "Should we build cross-platform with Flutter or native apps?",
                              answer: "For over 90% of business applications, cross-platform technologies like Flutter provide native-level performance, pixel-perfect UI, and 40% cost reduction by maintaining a single unified codebase. We recommend native development only when deep low-level hardware or OS customization is required."
                        },
                        {
                              question: "How do you test mobile apps across different smartphone models?",
                              answer: "We test on both physical device matrices (flagship and budget Android devices, iPhones across screen sizes) and automated cloud emulators to verify responsive layouts, memory consumption, and battery efficiency."
                        },
                        {
                              question: "Do you handle App Store and Google Play submissions?",
                              answer: "Yes, we handle the entire submission lifecycle: preparing store metadata, privacy policy disclosures, screenshots, signing certificates, and addressing reviewer inquiries until your app is officially approved."
                        }
                  ],
                  related: ["web-development", "ui-ux-design", "custom-software-development"]
            },
            {
                  id: "custom-software-development",
                  url: "custom-software-development",
                  name: "Custom Software Development",
                  category: "Enterprise Architecture",
                  pic: custom_software_development,
                  tagline: "Bespoke digital software engineered to your exact operational requirements.",
                  description: "Off-the-shelf software rarely fits intricate business workflows. We engineer tailored enterprise software platforms, automated workflow engines, and distributed backends that give your organization an unfair competitive edge.",
                  overview: "When pre-packaged software restricts your operational agility or forces costly licensing overhead, custom software is the definitive strategic investment. Bright Future Soft collaborates closely with leadership teams to analyze domain-specific complexities, architect clean data models, and build robust software that scales effortlessly.",
                  specs: {
                        engagement: "Full Agile Software Squad",
                        velocity: "2-Week Sprints with Continuous Delivery",
                        ownership: "100% Client-Owned Intellectual Property",
                        sla: "Dedicated Technical Lead & SLA Support"
                  },
                  features: [
                        {
                              title: "Domain-Driven Enterprise Architecture",
                              description: "Modular, loosely coupled software architecture designed specifically around your proprietary business workflows and security constraints.",
                              deliverable: "Architectural blueprint & system schema"
                        },
                        {
                              title: "High-Concurrency Backend Engines",
                              description: "High-throughput services capable of processing tens of thousands of complex transactions per second with transactional consistency.",
                              deliverable: "Benchmarked, load-tested backend engine"
                        },
                        {
                              title: "Enterprise Role-Based Access (RBAC)",
                              description: "Granular permissions, multi-tenant isolation, comprehensive audit logging, and single sign-on (SSO) integration via SAML/OAuth2.",
                              deliverable: "Multi-tenant security & permission matrix"
                        },
                        {
                              title: "Automated Testing & Code Quality",
                              description: "Comprehensive test suites encompassing unit, integration, and end-to-end regression testing with static code analysis.",
                              deliverable: "Automated test suites with >85% coverage"
                        }
                  ],
                  techStack: ["Node.js", "Go", "Python", "React", "PostgreSQL", "Docker", "Kubernetes", "Redis", "Kafka", "AWS"],
                  questions: [
                        {
                              question: "How is custom software development better than commercial off-the-shelf tools?",
                              answer: "Custom software eliminates recurring per-seat subscription fees, conforms 100% to your proprietary processes without clunky workarounds, provides total data sovereignty, and serves as an enterprise asset on your balance sheet."
                        },
                        {
                              question: "How long does custom enterprise software take to build?",
                              answer: "A focused Minimum Viable Product (MVP) typically takes 8 to 12 weeks. Comprehensive enterprise platforms are delivered in iterative 2-week agile sprints, providing usable working software at every milestone."
                        },
                        {
                              question: "What happens if our business requirements evolve mid-project?",
                              answer: "Our agile sprint methodology embraces change. At the start of each two-week sprint, we review priorities in your product backlog and re-align technical resources to address your latest strategic goals."
                        }
                  ],
                  related: ["erp-systems", "web-development", "legacy-system-modernization"]
            },
            {
                  id: "it-consulting",
                  url: "it-consulting",
                  name: "Strategic IT Consulting",
                  category: "Strategy & Governance",
                  pic: it_consulting,
                  tagline: "Technology roadmaps, cloud audits, and architectural leadership for executive teams.",
                  description: "Our IT consulting practice assists forward-thinking companies in selecting the right technology stacks, optimizing cloud infrastructure spending, auditing cybersecurity posture, and executing seamless digital transformations.",
                  overview: "Making the wrong architectural or vendor decision can cost millions and stall growth for years. Bright Future Soft's senior technology architects bring decades of real-world engineering experience to evaluate your IT ecosystem, uncover technical bottlenecks, and map out a practical, high-ROI technology roadmap.",
                  specs: {
                        engagement: "Principal Architect Advisory",
                        velocity: "Bi-Weekly Strategy Checkpoints",
                        ownership: "Executive Reports & Architecture Blueprints",
                        sla: "Advisory Hours & Incident Escalation"
                  },
                  features: [
                        {
                              title: "Architecture & Infrastructure Audits",
                              description: "In-depth technical review of existing codebases, database indexing, latency bottlenecks, and cloud infrastructure efficiency.",
                              deliverable: "Comprehensive technical audit & remediation plan"
                        },
                        {
                              title: "Cloud Migration & Cost Optimization",
                              description: "Practical strategies for migrating workloads to AWS, GCP, or Azure while right-sizing compute instances to cut cloud hosting bills by up to 40%.",
                              deliverable: "FinOps cloud cost reduction roadmap"
                        },
                        {
                              title: "Cybersecurity & Compliance Advisory",
                              description: "Assessment against ISO 27001, SOC2, and GDPR security frameworks, identifying vulnerabilities and hardening network perimeters.",
                              deliverable: "Security posture scorecard & action items"
                        },
                        {
                              title: "Technology Stack Evaluation",
                              description: "Objective evaluation of frameworks, programming languages, databases, and third-party vendors to eliminate technical debt.",
                              deliverable: "Vendor & technology selection matrix"
                        }
                  ],
                  techStack: ["AWS", "Google Cloud", "Azure", "Terraform", "Kubernetes", "SonarQube", "OWASP", "Grafana", "Prometheus"],
                  questions: [
                        {
                              question: "How does Bright Future Soft conduct an IT infrastructure audit?",
                              answer: "We review your repository code health, server configurations, database performance metrics, CI/CD pipelines, and network topology. We then present an executive report categorizing findings by severity, effort, and business impact."
                        },
                        {
                              question: "Can you help our company cut runaway cloud hosting expenses?",
                              answer: "Yes. Our FinOps cloud optimization audits frequently reduce monthly AWS and GCP bills by 25% to 45% by eliminating idle resources, implementing auto-scaling, optimizing database queries, and leveraging spot instances."
                        },
                        {
                              question: "Do your consultants assist in implementing recommendations?",
                              answer: "Yes. While we deliver strategic advisory reports, our engineering squads are also available to implement every architectural change, migration, and security fix directly."
                        }
                  ],
                  related: ["devops-ci-cd", "legacy-system-modernization", "custom-software-development"]
            },
            {
                  id: "data-analytics",
                  url: "data-analytics",
                  name: "Data Analytics & Business Intelligence",
                  category: "Data & Intelligence",
                  pic: data_analytics,
                  tagline: "Actionable business intelligence and automated data pipelines driving decision making.",
                  description: "Transform raw transactional logs and siloed databases into unified, real-time executive dashboards. We design robust ETL/ELT data pipelines, data warehouses, and predictive analytics models.",
                  overview: "Data is only valuable when decision-makers can extract clear insights in real time without waiting days for manual spreadsheets. We architect scalable data pipelines that ingest, clean, and visualize data from marketing channels, ERPs, CRM databases, and payment processors into interactive dashboards.",
                  specs: {
                        engagement: "Data Engineering & BI Specialists",
                        velocity: "Continuous Pipeline & Dashboard Delivery",
                        ownership: "100% Client-Owned Data Pipelines & Schemas",
                        sla: "Pipeline Reliability & Data Quality Monitoring"
                  },
                  features: [
                        {
                              title: "Modern Data Warehousing",
                              description: "Centralize disjointed business data in high-performance cloud warehouses (BigQuery, Snowflake, PostgreSQL) optimized for analytical SQL queries.",
                              deliverable: "Production cloud data warehouse schema"
                        },
                        {
                              title: "Automated ETL / ELT Pipelines",
                              description: "Resilient data ingestion pipelines using Python, dbt, and Apache Airflow that automatically sanitize, transform, and load data daily or in real time.",
                              deliverable: "Automated, monitored data pipelines"
                        },
                        {
                              title: "Executive Business Intelligence Dashboards",
                              description: "Interactive visual dashboards built with Power BI, Tableau, or custom React charting libraries giving executives visibility into revenue, churn, and KPIs.",
                              deliverable: "Role-tailored interactive BI dashboards"
                        },
                        {
                              title: "Predictive Analytics & Cohort Modeling",
                              description: "Statistical modeling and customer lifetime value (CLV) forecasting to pinpoint churn risks and predict upcoming demand trends.",
                              deliverable: "Predictive analytics models & reports"
                        }
                  ],
                  techStack: ["Python", "SQL", "BigQuery", "Snowflake", "PostgreSQL", "dbt", "Apache Airflow", "Power BI", "Tableau", "Apache Spark"],
                  questions: [
                        {
                              question: "What data sources can you integrate into our dashboard?",
                              answer: "We connect any data source with an API or database driver: relational SQL databases, MongoDB, Shopify/WooCommerce storefronts, Google Analytics, Stripe payment logs, ERPs, and custom internal systems."
                        },
                        {
                              question: "How do you guarantee data privacy and security?",
                              answer: "We employ role-based access control (RBAC), row-level database security, end-to-end data encryption, and strict anonymization protocols so sensitive customer data remains completely secure and compliant."
                        },
                        {
                              question: "Can we embed analytics dashboards directly into our customer SaaS portal?",
                              answer: "Yes. We specialize in embedded customer-facing analytics, engineering customized React dashboards with multi-tenant data isolation so each client views only their own metrics."
                        }
                  ],
                  related: ["erp-systems", "crm-solutions", "web-development"]
            },
            {
                  id: "devops-ci-cd",
                  url: "devops-ci-cd",
                  name: "DevOps & Cloud Infrastructure",
                  category: "Cloud & Reliability",
                  pic: DevOps,
                  tagline: "Automated CI/CD deployment pipelines, Kubernetes orchestration, and 99.9% uptime.",
                  description: "Accelerate feature releases from weeks to minutes. We implement infrastructure as code (IaC), automated Docker containerization, Kubernetes clusters, and zero-downtime blue/green deployment pipelines.",
                  overview: "Modern engineering teams cannot afford manual server configurations, unpredictable deployments, or middle-of-the-night downtime. Bright Future Soft builds self-healing cloud infrastructure on AWS, Google Cloud, and Azure that scales automatically with user traffic while safeguarding system reliability.",
                  specs: {
                        engagement: "DevOps & Cloud Infrastructure Engineers",
                        velocity: "Automated Continuous Deployment (CI/CD)",
                        ownership: "100% Client-Owned Infrastructure as Code",
                        sla: "24/7 Monitoring & Sub-15 Min Critical Response"
                  },
                  features: [
                        {
                              title: "Continuous Integration & Deployment (CI/CD)",
                              description: "Automated GitHub Actions or GitLab CI pipelines executing linting, unit testing, Docker builds, and zero-downtime production rollouts on every push.",
                              deliverable: "Automated multi-stage CI/CD workflow"
                        },
                        {
                              title: "Infrastructure as Code (Terraform)",
                              description: "Codified, version-controlled cloud infrastructure allowing reproducible staging, development, and production environments with zero manual drift.",
                              deliverable: "Modular Terraform scripts & configurations"
                        },
                        {
                              title: "Containerization & Kubernetes (K8s)",
                              description: "Microservice packaging with optimized multi-stage Dockerfiles orchestrated on AWS EKS or Google GKE with automated horizontal pod autoscaling.",
                              deliverable: "Production-ready Docker & K8s manifests"
                        },
                        {
                              title: "24/7 Monitoring, Metrics & Alerting",
                              description: "Comprehensive APM monitoring using Prometheus, Grafana, and ELK/Datadog with instant Slack/PagerDuty alerts for server anomalies.",
                              deliverable: "Real-time observability dashboard & alerts"
                        }
                  ],
                  techStack: ["Docker", "Kubernetes", "GitHub Actions", "Terraform", "AWS", "Google Cloud", "Grafana", "Prometheus", "Nginx", "Linux"],
                  questions: [
                        {
                              question: "How does CI/CD automation help our business?",
                              answer: "CI/CD automates all manual testing and deployment steps. It reduces human error by 90%, ensures broken code never reaches production, and allows your team to safely deploy bug fixes and new features multiple times daily."
                        },
                        {
                              question: "Can you migrate our monolithic application to Docker and Kubernetes?",
                              answer: "Yes. We assess your application dependencies, break down monolithic components into containerized services, configure networking and secrets management, and migrate your workloads to Kubernetes with zero downtime."
                        },
                        {
                              question: "Do you support multi-cloud or hybrid on-premise setups?",
                              answer: "Yes, we architect cloud solutions for AWS, Google Cloud, Microsoft Azure, and bare-metal hybrid data centers depending on your regulatory and data residency mandates."
                        }
                  ],
                  related: ["it-consulting", "web-development", "support-maintenance"]
            },
            {
                  id: "support-maintenance",
                  url: "support-maintenance",
                  name: "Support, Maintenance & SLA",
                  category: "Managed Engineering Services",
                  pic: support,
                  tagline: "Proactive 24/7 monitoring, security patching, and guaranteed rapid response SLAs.",
                  description: "Software requires continuous care to remain secure, fast, and compatible with evolving OS and browser updates. We provide SLA-backed maintenance, critical bug remediation, security audits, and database health checks.",
                  overview: "Deploying your software is only the beginning of its lifecycle. Without proactive monitoring and regular maintenance, technical debt accumulates, vulnerabilities emerge, and performance degrades. Bright Future Soft functions as your dedicated engineering operations team, guaranteeing rapid resolution of incidents.",
                  specs: {
                        engagement: "Dedicated SLA Maintenance Retainer",
                        velocity: "Continuous Monitoring & Monthly Health Sprints",
                        ownership: "Detailed Transparent Incident Logs",
                        sla: "Guaranteed Response Times (Up to 15-Minute Critical)"
                  },
                  features: [
                        {
                              title: "Proactive 24/7 System & Uptime Monitoring",
                              description: "Real-time synthetic transaction monitoring, server health checks, and database connection checks with rapid alerting for unexpected spikes.",
                              deliverable: "Monthly uptime & health performance reports"
                        },
                        {
                              title: "Security Patching & Dependency Updates",
                              description: "Regular scanning of codebases and third-party libraries (npm, pip, pub) for CVE vulnerabilities, applying patches and testing regressions.",
                              deliverable: "Zero-vulnerability security assurance"
                        },
                        {
                              title: "Critical Hotfix & Bug Remediation",
                              description: "Dedicated triage engineers available under strict SLA response windows to diagnose and resolve production bugs swiftly.",
                              deliverable: "Documented root cause analysis (RCA)"
                        },
                        {
                              title: "Database Indexing & Query Tuning",
                              description: "Routine optimization of slow database queries, log rotation, index rebuilding, and automated backup testing to maintain peak performance.",
                              deliverable: "Tuned database engine & verified backups"
                        }
                  ],
                  techStack: ["Grafana", "Sentry", "New Relic", "PagerDuty", "PostgreSQL", "Linux", "Docker", "Git", "SonarQube", "AWS CloudWatch"],
                  questions: [
                        {
                              question: "What response times do your SLA plans guarantee?",
                              answer: "We offer tiered SLA plans with critical emergency response times as fast as 15 to 30 minutes, 24/7/365. High-priority issues are addressed within 2 hours, and standard tickets within 24 hours."
                        },
                        {
                              question: "Can you maintain an application built by another development agency?",
                              answer: "Yes. We perform a thorough technical onboarding and code audit to understand the architecture, document undocumented modules, and establish automated deployment before assuming ongoing maintenance."
                        },
                        {
                              question: "Do maintenance plans include adding new features?",
                              answer: "Yes. Our flexible maintenance retainers allocate dedicated engineering hours each month that can be used interchangeably for feature enhancements, UI tweaks, or bug fixes."
                        }
                  ],
                  related: ["devops-ci-cd", "web-development", "custom-software-development"]
            },
            {
                  id: "e-commerce-solutions",
                  url: "e-commerce-solutions",
                  name: "E-commerce & Digital Commerce",
                  category: "Digital Commerce",
                  pic: e_commerce,
                  tagline: "High-converting digital storefronts, custom headless checkouts, and ERP sync.",
                  description: "We architect and develop enterprise e-commerce platforms designed for high conversion and high concurrency. From headless Shopify and WooCommerce setups to custom multi-vendor marketplaces, we handle every detail.",
                  overview: "Online shoppers demand instant page transitions, frictionless mobile checkouts, and real-time inventory precision. Bright Future Soft engineers high-speed e-commerce systems with custom product builders, multi-currency payment processing, automated shipping label generation, and bi-directional ERP synchronization.",
                  specs: {
                        engagement: "Commerce Engineering Squad",
                        velocity: "2-Week Sprints with Staging Previews",
                        ownership: "100% Client-Owned Storefront & Customer Data",
                        sla: "Black Friday & Holiday Peak Traffic Support"
                  },
                  features: [
                        {
                              title: "Headless E-commerce Architecture",
                              description: "Decoupled Next.js frontends connected to robust commerce backends for sub-second page loads, custom checkout funnels, and stellar SEO.",
                              deliverable: "High-speed headless storefront codebase"
                        },
                        {
                              title: "Global & Local Payment Integrations",
                              description: "Seamless checkout integration with international processors (Stripe, PayPal) and local gateways (SSLCommerz, bKash, Nagad) with automated reconciliation.",
                              deliverable: "PCI-compliant secure checkout pipeline"
                        },
                        {
                              title: "Inventory & Warehouse Synchronization",
                              description: "Real-time stock synchronization across multi-location warehouses, retail POS terminals, and third-party marketplace channels (Amazon, Daraz).",
                              deliverable: "Automated stock sync & order routing engine"
                        },
                        {
                              title: "Custom Multi-Vendor Marketplaces",
                              description: "Comprehensive vendor portals with automated commission calculation, split payouts, seller dashboards, and product approval workflows.",
                              deliverable: "Multi-vendor marketplace infrastructure"
                        }
                  ],
                  techStack: ["Next.js", "React", "Node.js", "Shopify", "WooCommerce", "Stripe", "SSLCommerz", "bKash", "PostgreSQL", "Redis"],
                  questions: [
                        {
                              question: "Why should we choose headless commerce over a standard template?",
                              answer: "Headless commerce separates the visual frontend from the commerce engine. This delivers up to 5x faster page loading speeds, complete freedom in UX design, higher search engine conversion, and resistance to peak traffic crashes."
                        },
                        {
                              question: "Can you handle high traffic volume during seasonal flash sales?",
                              answer: "Yes. We engineer Redis edge caching, database read replicas, and auto-scaling cloud infrastructure capable of processing thousands of simultaneous checkouts without timeout errors."
                        },
                        {
                              question: "Do you integrate with local and international payment gateways?",
                              answer: "Yes, we integrate Stripe, PayPal, Apple Pay, Google Pay, SSLCommerz, bKash, Nagad, and Rocket with automated transaction callbacks and fraud prevention checks."
                        }
                  ],
                  related: ["web-development", "erp-systems", "app-development"]
            },
            {
                  id: "erp-systems",
                  url: "erp-systems",
                  name: "Enterprise Resource Planning (ERP)",
                  category: "Enterprise Systems",
                  pic: erp,
                  tagline: "Unified ERP software integrating multi-branch finance, inventory, supply chain, and HR.",
                  description: "Centralize your entire enterprise operations into a unified, secure platform. We engineer custom ERP systems covering multi-warehouse inventory, double-entry financial accounting, manufacturing, and HRMS payroll.",
                  overview: "Disjointed spreadsheets and legacy departmental tools create data silos, calculation discrepancies, and delayed decision-making. Bright Future Soft builds tailored, role-governed ERP systems that synchronize real-time data across procurement, warehousing, sales, finance, and human resources.",
                  specs: {
                        engagement: "Enterprise ERP Architects & Engineers",
                        velocity: "Phased Milestone Delivery & User Training",
                        ownership: "100% Client-Owned Source & Database Schema",
                        sla: "Dedicated Account Lead & Operations Support"
                  },
                  features: [
                        {
                              title: "Multi-Warehouse Inventory & Batch Tracking",
                              description: "Real-time tracking of stock levels, barcode scanning, batch expiry tracking, reorder point triggers, and transfer orders between locations.",
                              deliverable: "Centralized inventory management module"
                        },
                        {
                              title: "Double-Entry Financial Accounting",
                              description: "Comprehensive general ledger, accounts payable/receivable, automated bank reconciliation, VAT compliance, and real-time P&L reporting.",
                              deliverable: "Audit-ready financial accounting suite"
                        },
                        {
                              title: "Procurement & Supply Chain Management",
                              description: "Automated purchase orders, vendor evaluation scorecards, goods received notes (GRN), and multi-tier approval workflows.",
                              deliverable: "End-to-end procurement lifecycle module"
                        },
                        {
                              title: "HRMS, Attendance & Automated Payroll",
                              description: "Employee records management, biometric machine attendance sync, leave management, tax deductions, and automated salary slip disbursement.",
                              deliverable: "Integrated HR & payroll software module"
                        }
                  ],
                  techStack: ["Node.js", "React", "PostgreSQL", "TypeScript", "Docker", "Redis", "REST APIs", "Tailwind CSS", "Linux"],
                  questions: [
                        {
                              question: "How is a custom ERP better than commercial platforms like SAP or Oracle?",
                              answer: "Off-the-shelf tier-1 ERPs cost hundreds of thousands in licensing, require years of expensive customization, and often confuse staff with unneeded features. Our custom ERPs are built precisely for your workflow, have zero per-user recurring license fees, and adapt as you expand."
                        },
                        {
                              question: "How do you migrate existing company data into the new ERP?",
                              answer: "We perform a systematic data audit, cleanse duplicate records, validate historical ledger balances, and execute staging dry-run migrations before cutting over to ensure zero data loss."
                        },
                        {
                              question: "Can our remote branch offices access the ERP securely?",
                              answer: "Yes. Our ERPs are built as responsive, cloud-hosted web platforms with role-based access control (RBAC), multi-factor authentication (MFA), and encrypted VPN support for secure multi-branch access."
                        }
                  ],
                  related: ["crm-solutions", "custom-software-development", "data-analytics"]
            },
            {
                  id: "legacy-system-modernization",
                  url: "legacy-system-modernization",
                  name: "Legacy System Modernization",
                  category: "Modernization & Transformation",
                  pic: legacy,
                  tagline: "Upgrade outdated legacy software to modern cloud architectures with zero downtime.",
                  description: "Don't let legacy code hold your enterprise back. We systematically modernize monolithic, insecure, and sluggish applications into resilient cloud-native architectures without interrupting daily operations.",
                  overview: "Outdated legacy software exposes companies to critical security vulnerabilities, skyrocketing maintenance costs, and an inability to integrate with modern APIs. Bright Future Soft uses the Strangler Fig pattern to progressively migrate legacy databases, backends, and interfaces into modern microservices with zero business disruption.",
                  specs: {
                        engagement: "Enterprise Modernization Squad",
                        velocity: "Phased Safe Iterations with Zero Downtime",
                        ownership: "100% Client-Owned Modernized Repositories",
                        sla: "Parallel Running & Data Parity Guarantees"
                  },
                  features: [
                        {
                              title: "Strangler Fig Architectural Migration",
                              description: "Progressive replacement of monolithic legacy modules with modern microservices, running in parallel to ensure business continuity.",
                              deliverable: "Modernized service architecture & roadmap"
                        },
                        {
                              title: "Zero-Downtime Database Migration",
                              description: "Extracting, transforming, and synchronizing legacy databases (MS SQL, Oracle, raw files) into modern PostgreSQL or cloud databases.",
                              deliverable: "Sanitized data migration with verification"
                        },
                        {
                              title: "Legacy Monolith to Cloud-Native Microservices",
                              description: "Re-platforming on-premise servers to AWS or Google Cloud containerized environments, improving scalability and slashing infrastructure overhead.",
                              deliverable: "Containerized cloud infrastructure"
                        },
                        {
                              title: "Security Hardening & API Exposure",
                              description: "Wrapping legacy business logic in modern, secure REST/GraphQL endpoints with token authentication, encryption, and audit logs.",
                              deliverable: "Secure modern API gateway"
                        }
                  ],
                  techStack: ["Node.js", "Go", "Docker", "PostgreSQL", "React", "Kubernetes", "AWS", "Redis", "TypeScript"],
                  questions: [
                        {
                              question: "Will our daily business operations stop during the modernization process?",
                              answer: "No. We utilize parallel running and phased migration (the Strangler Fig pattern). New features and services run alongside the legacy system, synchronizing data bidirectionally so your business never experiences downtime."
                        },
                        {
                              question: "How do you guarantee that historical financial and customer data is not lost?",
                              answer: "We perform automated data validation checksums, schema reconciliation tests, and parallel verification audits where both systems process the same data to confirm 100% mathematical parity before cutover."
                        },
                        {
                              question: "What are the tangible financial benefits of modernizing legacy software?",
                              answer: "Modernization cuts infrastructure maintenance fees by up to 50%, eliminates expensive legacy vendor licenses, accelerates new feature deployment speed by 4x, and eliminates vulnerabilities."
                        }
                  ],
                  related: ["custom-software-development", "erp-systems", "it-consulting"]
            },
            {
                  id: "crm-solutions",
                  url: "crm-solutions",
                  name: "CRM Solutions & Automation",
                  category: "Customer Systems",
                  pic: crm,
                  tagline: "Custom customer relationship management platforms engineered to accelerate sales pipelines.",
                  description: "Empower your sales, marketing, and customer support teams with bespoke CRM platforms. Automate lead distribution, pipeline tracking, omnichannel customer communication, and predictive revenue forecasting.",
                  overview: "Standard CRM platforms are frequently bloated with complex settings and exorbitant per-user monthly costs. Bright Future Soft builds tailored CRM solutions that align precisely with your sales stages, client communication channels, and automated follow-up workflows.",
                  specs: {
                        engagement: "CRM & Workflow Automation Squad",
                        velocity: "2-Week Agile Delivery with Hands-On Demos",
                        ownership: "100% Client-Owned CRM Software & Data",
                        sla: "Dedicated Onboarding & Operational SLA"
                  },
                  features: [
                        {
                              title: "Intelligent Lead Routing & Scoring",
                              description: "Automatically capture leads from websites, WhatsApp, social media, and emails, scoring and assigning them instantly to available sales reps.",
                              deliverable: "Automated lead distribution engine"
                        },
                        {
                              title: "Visual Sales Pipeline & Deal Forecasting",
                              description: "Intuitive Kanban deal boards reflecting your unique sales stages, conversion probability metrics, and revenue forecast analytics.",
                              deliverable: "Interactive sales pipeline dashboard"
                        },
                        {
                              title: "Omnichannel Customer History & Chat",
                              description: "Unified communication timeline tracking phone logs, emails, WhatsApp messages, and meeting notes in a single customer record.",
                              deliverable: "Omnichannel customer timeline module"
                        },
                        {
                              title: "Automated Workflows & Drip Sequences",
                              description: "Trigger automated follow-up emails, contract signing reminders, task assignments, and renewal notifications based on deal progress.",
                              deliverable: "Configurable workflow automation engine"
                        }
                  ],
                  techStack: ["React", "Node.js", "PostgreSQL", "Redis", "TypeScript", "Tailwind CSS", "Twilio", "SendGrid", "Docker"],
                  questions: [
                        {
                              question: "Can our custom CRM integrate with WhatsApp and email?",
                              answer: "Yes. We integrate WhatsApp Business API, corporate email (Google Workspace/Office 365), and telephony systems so reps can send messages and track customer threads directly inside the CRM."
                        },
                        {
                              question: "How does a custom CRM save our company money?",
                              answer: "Commercial CRMs like Salesforce charge $150+ per user every single month, resulting in heavy ongoing expenditure. A custom Bright Future Soft CRM is a one-time capital investment with zero per-seat licensing fees for unlimited staff."
                        },
                        {
                              question: "Can you migrate our existing contacts and deal history from another CRM?",
                              answer: "Yes. We extract and clean your contact records, conversation notes, and past deal histories from HubSpot, Zoho, or CSV spreadsheets and migrate them seamlessly into your new CRM."
                        }
                  ],
                  related: ["erp-systems", "data-analytics", "web-development"]
            }
      ];

const Read_more_service = () => {
      const { id } = useParams();
      const [schedule, setSchedule] = useState(false);
      const [openQuestionId, setOpenQuestionId] = useState(0);

      const { data: teamMembers = [] } = useQuery({
            queryKey: ["all_users"],
            queryFn: async () => {
                  const res = await fetch(`${base_url}/auth/all`, {
                        headers: {
                              "content-type": "application/json",
                              author: "bright_future_soft",
                        },
                  });
                  const json = await res.json();
                  const data = json?.data || [];
                  return data
                        .filter(user => user.slot != null)
                        .sort((a, b) => {
                              if (a.slot === b.slot) {
                                    return (a.name || "").localeCompare(b.name || "");
                              }
                              return Number(a.slot) - Number(b.slot);
                        });
            },
      });

      // Find current selected service
      const selectedOffer = serviceInfo.find(offer => offer.url === id || offer.id === id);

      const handleToggle = (e, questionId) => {
            if (e) {
                  e.preventDefault();
            }
            setOpenQuestionId(prev => (prev === questionId ? null : questionId));
      };

      // Only scroll to top when navigating to a new service route
      useEffect(() => {
            window.scrollTo(0, 0);
      }, [id]);

      // SEO & Meta tags management
      useEffect(() => {
            if (!selectedOffer?.name) {
                  document.title = "Service Details | Bright Future Soft";
                  return;
            }

            // Title
            document.title = `${selectedOffer.name} Services | Bright Future Soft`;

            const metaDescription =
                  selectedOffer.description.length > 160
                        ? `${selectedOffer.description.slice(0, 157)}...`
                        : selectedOffer.description;

            // Meta Description
            let descTag = document.querySelector("meta[name='description']");
            if (!descTag) {
                  descTag = document.createElement("meta");
                  descTag.name = "description";
                  document.head.appendChild(descTag);
            }
            descTag.setAttribute("content", metaDescription);

            // Canonical URL
            const canonicalUrl = window.location.href;
            let canonical = document.querySelector("link[rel='canonical']");
            if (!canonical) {
                  canonical = document.createElement("link");
                  canonical.setAttribute("rel", "canonical");
                  document.head.appendChild(canonical);
            }
            canonical.setAttribute("href", canonicalUrl);

            // OG Title
            let ogTitle = document.querySelector("meta[property='og:title']");
            if (!ogTitle) {
                  ogTitle = document.createElement("meta");
                  ogTitle.setAttribute("property", "og:title");
                  document.head.appendChild(ogTitle);
            }
            ogTitle.setAttribute("content", `${selectedOffer.name} | Bright Future Soft`);

            // OG Description
            let ogDesc = document.querySelector("meta[property='og:description']");
            if (!ogDesc) {
                  ogDesc = document.createElement("meta");
                  ogDesc.setAttribute("property", "og:description");
                  document.head.appendChild(ogDesc);
            }
            ogDesc.setAttribute("content", metaDescription);

            // Schema.org Structured Data: Service + FAQPage + BreadcrumbList
            const serviceSchema = {
                  "@context": "https://schema.org",
                  "@graph": [
                        {
                              "@type": "BreadcrumbList",
                              "itemListElement": [
                                    {
                                          "@type": "ListItem",
                                          "position": 1,
                                          "name": "Home",
                                          "item": "https://brightfuturesoft.com"
                                    },
                                    {
                                          "@type": "ListItem",
                                          "position": 2,
                                          "name": "Services",
                                          "item": "https://brightfuturesoft.com/service"
                                    },
                                    {
                                          "@type": "ListItem",
                                          "position": 3,
                                          "name": selectedOffer.name,
                                          "item": canonicalUrl
                                    }
                              ]
                        },
                        {
                              "@type": "Service",
                              "@id": canonicalUrl,
                              "name": selectedOffer.name,
                              "serviceType": selectedOffer.category,
                              "description": selectedOffer.description,
                              "provider": {
                                    "@type": "Organization",
                                    "name": "Bright Future Soft",
                                    "url": "https://brightfuturesoft.com",
                                    "logo": "https://brightfuturesoft.com/assets/logo.png"
                              },
                              "areaServed": "Global",
                              "offers": {
                                    "@type": "Offer",
                                    "price": "Contact for Consultation",
                                    "priceCurrency": "USD"
                              }
                        },
                        {
                              "@type": "FAQPage",
                              "mainEntity": selectedOffer.questions.map(q => ({
                                    "@type": "Question",
                                    "name": q.question,
                                    "acceptedAnswer": {
                                          "@type": "Answer",
                                          "text": q.answer
                                    }
                              }))
                        }
                  ]
            };

            let scriptTag = document.getElementById("service-details-schema-jsonld");
            if (!scriptTag) {
                  scriptTag = document.createElement("script");
                  scriptTag.id = "service-details-schema-jsonld";
                  scriptTag.type = "application/ld+json";
                  document.head.appendChild(scriptTag);
            }
            scriptTag.text = JSON.stringify(serviceSchema);

            return () => {
                  const tag = document.getElementById("service-details-schema-jsonld");
                  if (tag) tag.remove();
            };
      }, [id, selectedOffer?.name]);

      // Service Not Found View
      if (!selectedOffer) {
            return (
                  <main className="service-details-page py-24 px-4 text-center">
                        <div className="max-w-md mx-auto bg-white p-10 rounded-lg border border-[#e1e9f2] shadow-sm">
                              <span className="site-eyebrow">404 Error</span>
                              <h1 className="text-2xl font-bold text-[#142235] mt-3">Service Not Found</h1>
                              <p className="text-sm text-[#55667c] mt-2 mb-6">
                                    The software service you are searching for may have been moved or updated.
                              </p>
                              <Link
                                    to="/service"
                                    className="service-btn-primary"
                              >
                                    View All Services
                              </Link>
                        </div>
                  </main>
            );
      }

      // Related services
      const relatedServices = serviceInfo.filter(s => 
            selectedOffer.related?.includes(s.id) && s.id !== selectedOffer.id
      ).slice(0, 3);

      return (
            <main className="py-20 px-4 md:px-0">
                  {/* Breadcrumb Navigation */}
                

                  {/* Header / Hero Section */}
                  <header className="service-details-header  py-20 ">
                        <div className="max-w-7xl mx-auto md:grid grid-cols-1  md:grid-cols-2 items-center gap-12  ">
                              <div className="">
                                    <span className="service-details-meta-tag">{selectedOffer.category}</span>
                                    <h1 className="service-details-h1">{selectedOffer.name}</h1>
                                    <p className="service-details-summary">{selectedOffer.description}</p>

                                    {/* Quick Delivery Specs Matrix */}
                                    <div className="service-details-quick-specs" aria-label="Key delivery metrics">
                                          <div className="service-spec-pill">
                                                <HiCodeBracket aria-hidden="true" />
                                                <div>
                                                      <span className="service-spec-label">Engagement Model</span>
                                                      <span className="service-spec-val">{selectedOffer.specs?.engagement || "Dedicated Squad"}</span>
                                                </div>
                                          </div>
                                          <div className="service-spec-pill">
                                                <HiClock aria-hidden="true" />
                                                <div>
                                                      <span className="service-spec-label">Sprint Cadence</span>
                                                      <span className="service-spec-val">{selectedOffer.specs?.velocity || "2-Week Sprints"}</span>
                                                </div>
                                          </div>
                                          <div className="service-spec-pill">
                                                <HiShieldCheck aria-hidden="true" />
                                                <div>
                                                      <span className="service-spec-label">Code Ownership</span>
                                                      <span className="service-spec-val">{selectedOffer.specs?.ownership || "100% Client-Owned"}</span>
                                                </div>
                                          </div>
                                          <div className="service-spec-pill">
                                                <HiCheckCircle aria-hidden="true" />
                                                <div>
                                                      <span className="service-spec-label">Service SLA</span>
                                                      <span className="service-spec-val">{selectedOffer.specs?.sla || "Dedicated Support"}</span>
                                                </div>
                                          </div>
                                    </div>

                                    {/* CTA Row */}
                                    <div className="service-details-cta-row">
                                          <button
                                                type="button"
                                                onClick={() => setSchedule(true)}
                                                className="service-btn-primary"
                                          >
                                                <HiCalendarDays className="text-lg" aria-hidden="true" />
                                                <span>Book Technical Scoping Call</span>
                                          </button>
                                          <a href="#core-deliverables" className="service-btn-secondary">
                                                <span>Explore Deliverables</span>
                                                <HiArrowSmallRight aria-hidden="true" />
                                          </a>
                                    </div>
                              </div>

                              {/* Media Box */}
                              <div className="service-details-media-box mt-4 md:mt-0">
                                    <div className="media-frame">
                                          <img
                                                src={selectedOffer.pic}
                                                alt={`${selectedOffer.name} software engineering architectural overview`}
                                                loading="eager"
                                          />
                                    </div>
                              </div>
                        </div>
                  </header>

                  {/* Core Capabilities & Deliverables */}
                  <section id="core-deliverables" className="max-w-7xl mx-auto py-20" aria-labelledby="deliverables-heading">
                        <div className="service-section-header">
                              <span className="site-eyebrow">Tangible Outputs</span>
                              <h2 id="deliverables-heading" className="text-2xl sm:text-3xl font-bold text-[#142235] mt-2">
                                    Core Capabilities & Deliverables
                              </h2>
                              <p className="text-sm sm:text-base text-[#55667c] mt-2 max-w-2xl">
                                    Every sprint delivers measurable, production-ready software assets backed by strict automated testing and enterprise documentation.
                              </p>
                        </div>

                        <div className="service-deliverables-grid">
                              {selectedOffer.features.map((feature, idx) => (
                                    <div key={idx} className="service-deliverable-card">
                                          <div className="service-deliverable-head">
                                                <div className="service-deliverable-num">
                                                      0{idx + 1}
                                                </div>
                                                <h3 className="service-deliverable-title">{feature.title}</h3>
                                          </div>
                                          <p className="service-deliverable-desc">{feature.description}</p>
                                          {feature.deliverable && (
                                                <div className="service-deliverable-output">
                                                      <HiCheck aria-hidden="true" />
                                                      <span>Deliverable: {feature.deliverable}</span>
                                                </div>
                                          )}
                                    </div>
                              ))}
                        </div>
                  </section>

                  {/* Technology Stack & Tooling */}
                  {selectedOffer.techStack && (
                        <section className="service-tech-sec" aria-labelledby="tech-heading">
                              <div className="max-w-5xl mx-auto">
                                    <div className="text-center">
                                          <span className="site-eyebrow">Enterprise Stacks</span>
                                          <h2 id="tech-heading" className="text-2xl sm:text-3xl font-bold text-[#142235] mt-2">
                                                Technologies & Frameworks We Employ
                                          </h2>
                                          <p className="text-sm sm:text-base text-[#55667c] mt-2 max-w-xl mx-auto">
                                                We engineer using battle-tested modern open-source stacks with zero proprietary lock-in.
                                          </p>
                                    </div>

                                    <div className="service-tech-grid justify-center">
                                          {selectedOffer.techStack.map((tech, idx) => (
                                                <div key={idx} className="service-tech-pill">
                                                      <span className="service-tech-pill-dot" aria-hidden="true" />
                                                      <span>{tech}</span>
                                                </div>
                                          ))}
                                    </div>
                              </div>
                        </section>
                  )}

                  {/* 4-Step Engineering Lifecycle */}
                  <section className="max-w-7xl mx-auto py-20" aria-labelledby="lifecycle-heading">
                        <div className="text-center max-w-2xl mx-auto mb-10">
                              <span className="site-eyebrow">Our Methodology</span>
                              <h2 id="lifecycle-heading" className="text-2xl sm:text-3xl font-bold text-[#142235] mt-2">
                                    How We Engineer & Deliver
                              </h2>
                              <p className="text-sm sm:text-base text-[#55667c] mt-2">
                                    A structured four-phase delivery methodology that turns high-level visions into resilient production software.
                              </p>
                        </div>

                        <div className="service-lifecycle-grid">
                              <div className="service-lifecycle-step">
                                    <div className="service-lifecycle-step-num">Step 01</div>
                                    <h4>Discovery & Scoping</h4>
                                    <p>We analyze user stories, system dependencies, architectural trade-offs, and establish a clear sprint roadmap.</p>
                              </div>
                              <div className="service-lifecycle-step">
                                    <div className="service-lifecycle-step-num">Step 02</div>
                                    <h4>Architecture & Prototype</h4>
                                    <p>We draft database schemas, API specs, and interactive UI prototypes before writing production code.</p>
                              </div>
                              <div className="service-lifecycle-step">
                                    <div className="service-lifecycle-step-num">Step 03</div>
                                    <h4>Agile Sprints & QA</h4>
                                    <p>Iterative 2-week development sprints with automated CI/CD builds, peer reviews, and live milestone demos.</p>
                              </div>
                              <div className="service-lifecycle-step">
                                    <div className="service-lifecycle-step-num">Step 04</div>
                                    <h4>Deployment & SLA</h4>
                                    <p>Zero-downtime production deployment, security signoff, and ongoing 24/7 SLA maintenance support.</p>
                              </div>
                        </div>
                  </section>

                  {/* Frequently Asked Questions Accordion */}
                  <section className="service-section-wrap" aria-labelledby="service-faq-heading">
                        <div className="text-center max-w-2xl mx-auto mb-10">
                              <span className="site-eyebrow">Service Questions</span>
                              <h2 id="service-faq-heading" className="text-2xl sm:text-3xl font-bold text-[#142235] mt-2">
                                    Frequently Asked Questions
                              </h2>
                              <p className="text-sm sm:text-base text-[#55667c] mt-2">
                                    Direct answers regarding technical execution, deliverables, and team collaboration.
                              </p>
                        </div>

                        <div className="service-faq-container">
                              {selectedOffer.questions.map((faq, idx) => {
                                    const isOpen = openQuestionId === idx;
                                    return (
                                          <div key={idx} className={`service-faq-item ${isOpen ? "is-open" : ""}`}>
                                                <button
                                                      type="button"
                                                      className="service-faq-btn"
                                                      onClick={(e) => handleToggle(e, idx)}
                                                      aria-expanded={isOpen}
                                                >
                                                      <span>{faq.question}</span>
                                                      <span className="service-faq-icon" aria-hidden="true">
                                                            <HiChevronDown />
                                                      </span>
                                                </button>
                                                {isOpen && (
                                                      <div className="service-faq-answer">
                                                            <p>{faq.answer}</p>
                                                      </div>
                                                )}
                                          </div>
                                    );
                              })}
                        </div>

                        {/* Consultation CTA Card */}
                        <div className="public-contact-cta mx-auto mt-12 max-w-3xl overflow-hidden text-center">
                              <div className="px-6 py-10 sm:p-12">
                                    <div className="max-w-md mx-auto">
                                          {/* Team Member Avatars */}
                                          {Array.isArray(teamMembers) && teamMembers.length > 0 && (
                                                <div className="relative z-0 flex items-center justify-center -space-x-2 mb-4">
                                                      {teamMembers.slice(0, 3).map((member, index) => (
                                                            <img
                                                                  key={member._id || index}
                                                                  className={`relative inline-block object-cover rounded-full w-12 h-12 ring-4 ring-white shadow-sm transition-all duration-300 ${
                                                                        index === 2 ? "opacity-90" : "opacity-100"
                                                                  }`}
                                                                  src={member.image}
                                                                  alt={member.name || "Engineering Team Member"}
                                                            />
                                                      ))}
                                                      {teamMembers.length > 3 && (
                                                            <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-[#0a65b4] text-white text-xs font-bold ring-4 ring-white shadow-sm">
                                                                  +{teamMembers.length - 3}
                                                            </div>
                                                      )}
                                                </div>
                                          )}

                                          <h3 className="text-2xl font-bold text-[#142235]">
                                                Still have architectural questions?
                                          </h3>
                                          <p className="mt-2 text-sm text-[#55667c]">
                                                Can't find the exact technical specification you need? Connect directly with our senior solutions engineers for a free 30-minute scoping session.
                                          </p>
                                          <div className="mt-6">
                                                <button
                                                      onClick={() => setSchedule(true)}
                                                      className="service-btn-primary"
                                                      type="button"
                                                >
                                                      <HiCalendarDays className="text-lg" aria-hidden="true" />
                                                      <span>Start Free Technical Consultation</span>
                                                </button>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </section>

                  {/* Related Services Navigation */}
                  {relatedServices.length > 0 && (
                        <section className="max-w-7xl mx-auto " aria-labelledby="related-heading">
                              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#e1e9f2]">
                                    <div>
                                          <span className="site-eyebrow">Explore More</span>
                                          <h2 id="related-heading" className="text-2xl font-bold text-[#142235] mt-1">
                                                Related Engineering Services
                                          </h2>
                                    </div>
                                    <Link to="/service" className="text-xs font-bold text-[#0a65b4] hover:underline mt-2 sm:mt-0">
                                          View All 12 Services →
                                    </Link>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {relatedServices.map(service => (
                                          <Link
                                                key={service.id}
                                                to={`/service/${service.id}`}
                                                className="service-grid-card group"
                                          >
                                                <article className="flex h-full flex-col">
                                                      <div className="service-card-media">
                                                            <img
                                                                  src={service.pic}
                                                                  alt={`${service.name} services`}
                                                                  loading="lazy"
                                                            />
                                                      </div>
                                                      <div className="service-card-body">
                                                            <span className="service-card-tag">{service.category}</span>
                                                            <h3 className="service-card-title">{service.name}</h3>
                                                            <p className="service-card-desc">{service.tagline || service.description.slice(0, 110)}</p>
                                                            <div className="service-card-action">
                                                                  <span>Explore Service</span>
                                                                  <HiArrowSmallRight aria-hidden="true" />
                                                            </div>
                                                      </div>
                                                </article>
                                          </Link>
                                    ))}
                              </div>
                        </section>
                  )}

                  {/* Calendly Booking Modal */}
                  {schedule && (
                        <CallSchedule isModalOpen={schedule} setModalOpen={setSchedule} />
                  )}
            </main>
      );
};

export default Read_more_service;
