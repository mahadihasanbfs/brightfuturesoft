import React from 'react';
import { HiOutlineCodeBracket } from 'react-icons/hi2';
import tailwind from '../../../Assctes/icon/Tailwind.png'
import bootstrap from '../../../Assctes/icon/Bootstrap.png'
import metarial from '../../../Assctes/icon/Material UI.png'
import typescript from '../../../Assctes/icon/TypeScript.png'
import react from '../../../Assctes/icon/React.png'
import redux from '../../../Assctes/icon/redux.png'
import js from '../../../Assctes/icon/JavaScript.png'
import nextJs from '../../../Assctes/icon/nextjs-boilerplate-logo.png';
import ashtro from '../../../Assctes/icon/Astro.png';
import nest from '../../../Assctes/icon/Nest.js.png';
import vue from '../../../Assctes/icon/Vue.js.png';
import angular from '../../../Assctes/icon/Angular.png';

//backend
import nodejs from '../../../Assctes/icon/Node.js.png'
import python from '../../../Assctes/icon/python.png'
import php from '../../../Assctes/icon/php.png'
import go from '../../../Assctes/icon/go.png'
import express from '../../../Assctes/icon/Express.png'
import dj from '../../../Assctes/icon/dj.png'
import Laravel from '../../../Assctes/icon/Laravel.png'
import Fastify from '../../../Assctes/icon/Fastify.png'


//database
import mongo from '../../../Assctes/icon/mongodb.png'
import mysql from '../../../Assctes/icon/mySQL.png'
import postgres from '../../../Assctes/icon/postgress.png'
import firebase from '../../../Assctes/icon/firebase.png'
import Microsoft from '../../../Assctes/icon/Microsoft SQL.png';
import Redis from '../../../Assctes/icon/Redis.png';

//tools
import git from '../../../Assctes/icon/git.png';
import figma from '../../../Assctes/icon/figma.png'
import azure from '../../../Assctes/icon/azure.png'
import aws from '../../../Assctes/icon/aws.png'
import jest from '../../../Assctes/icon/Jest.png'
import Docker from '../../../Assctes/icon/Docker.png'
import SonarQube from '../../../Assctes/icon/SonarQube.png'
import Postman from '../../../Assctes/icon/postman.png'
import slack from '../../../Assctes/icon/slack.png'
import graphql from '../../../Assctes/icon/graphql.png'

//mobile apps

import Swift from '../../../Assctes/icon/Swift.png'
import Flutter from '../../../Assctes/icon/Flatter.png'
import Kotlin from '../../../Assctes/icon/Kotlin.png'
import Ionic from '../../../Assctes/icon/Ionic.png'


// payment getaway

import ssl from '../../../Assctes/icon/ssl.png'
import strip from '../../../Assctes/icon/stripe.png'
import bkash from '../../../Assctes/icon/Bkash.png'
import nogod from '../../../Assctes/icon/nogod.png'
import paypal from '../../../Assctes/icon/Paypal.png';
import AmarPay from '../../../Assctes/icon/amarpay.png';



// import firebase from '../../../Assctes/icon/firebase.png'





const Technology = () => {

      const tData = [
            {
                  id: 0,
                  title: "Frontend Technology",
                  options: [
                        {
                              id: 0,
                              name: "tailwind", img: tailwind
                        },
                        {
                              id: 1,
                              name: "bootstrap", img: bootstrap
                        },
                        {
                              id: 2,
                              name: "metarial", img: metarial
                        },
                        {
                              id: 3,
                              name: "typescript", img: typescript
                        },
                        {
                              id: 4,
                              name: "react", img: react
                        },
                        {
                              id: 5,
                              name: "redux", img: redux
                        },
                        {
                              id: 6,
                              name: "java script", img: js
                        },
                        {
                              id: 7,
                              name: "next js", img: nextJs
                        },
                        {
                              id: 8,
                              name: "Astro", img: ashtro
                        },

                        {
                              id: 10,
                              name: "Angular", img: angular
                        },
                        {
                              id: 11,
                              name: "Vue", img: vue
                        }
                  ]
            },
            {
                  id: 1,
                  title: "Backend Technology",
                  options: [
                        {
                              id: 0,
                              name: "node js", img: nodejs
                        },
                        {
                              id: 1,
                              name: "Python", img: python
                        },
                        {
                              id: 2,
                              name: "PHP", img: php
                        },
                        {
                              id: 3,
                              name: "GO", img: go
                        },
                        {
                              id: 4,
                              name: "Express JS", img: express
                        },

                        {
                              id: 5,
                              name: "Django", img: dj
                        },
                        {
                              id: 6,
                              name: "Laravel", img: Laravel
                        },
                        {
                              id: 7,
                              name: "Fastify", img: Fastify
                        },
                        {
                              id: 9,
                              name: "Nest.js", img: nest
                        },
                  ]
            },
            {
                  id: 3,
                  title: "Database",
                  options: [
                        {
                              id: 0,
                              name: "MongoDB", img: mongo
                        },
                        {
                              id: 1,
                              name: "Firebase", img: firebase
                        },
                        {
                              id: 2,
                              name: "MySql", img: mysql
                        },
                        {
                              id: 3,
                              name: "Postgres", img: postgres
                        },
                        {
                              id: 4,
                              name: "Microsoft SQL", img: Microsoft
                        },
                        {
                              id: 5,
                              name: "Redis", img: Redis
                        }
                  ]
            },
            {
                  id: 2,
                  title: "Tools",
                  options: [
                        {
                              id: 0,
                              name: "Git", img: git
                        },
                        {
                              id: 1,
                              name: "figma", img: figma
                        },
                        {
                              id: 2,
                              name: "Azure", img: azure
                        },
                        {
                              id: 3,
                              name: "AWS", img: aws
                        },
                        {
                              id: 4,
                              name: "Jest", img: jest
                        },
                        {
                              id: 5,
                              name: "Docker", img: Docker
                        },
                        {
                              id: 6,
                              name: "SonarQube", img: SonarQube
                        },
                        {
                              id: 7,
                              name: "Postman", img: Postman
                        },
                        {
                              id: 8,
                              name: "Slack", img: slack
                        },
                        {
                              id: 9,
                              name: "Graphql", img: graphql
                        }

                  ]
            },
            {
                  id: 3,
                  title: "Mobile App Development",
                  options: [
                        {
                              id: 0,
                              name: "React Native", img: react
                        },
                        {
                              id: 1,
                              name: "Swift", img: Swift
                        },
                        {
                              id: 2,
                              name: "Flutter", img: Flutter
                        },
                        {
                              id: 3,
                              name: "Kotlin", img: Kotlin
                        },
                        {
                              id: 4,
                              name: "Ionic", img: Ionic
                        }
                  ]
            },
            {
                  id: 4,
                  title: "Payment Gateways",
                  options: [
                        {
                              id: 0,
                              name: "SSLCOMMERZ ", img: ssl
                        },
                        {
                              id: 1,
                              name: "Stripe", img: strip
                        },
                        {
                              id: 2,
                              name: "Paypal", img: paypal
                        },
                        {
                              id: 3,
                              name: "Bkash", img: bkash,
                        },
                        {
                              id: 4,
                              name: "Nagad", img: nogod,
                        },
                        {
                              id: 5,
                              name: "AmarPay", img: AmarPay,
                        },

                  ]
            },
      ]
      return (
            <section className="tech-bg technology-section px-4 py-20 sm:px-6 lg:px-8 lg:py-24" id="tech" aria-labelledby="technology-heading">
                  <div className="mx-auto max-w-7xl">
                        <div className="section-heading-row">
                              <div><span className="site-eyebrow">A modern, proven stack</span><h2 id="technology-heading">The right tools<br /><span>for the right solution.</span></h2></div>
                              <p>We choose reliable technologies to fit each product’s needs, from responsive interfaces to secure, scalable platforms.</p>
                        </div>
                        <div className="technology-grid">
                              {tData.map((category) => (
                                    <article className="technology-card" key={category.id}>
                                          <div className="technology-card-heading"><span><HiOutlineCodeBracket aria-hidden="true" /></span><h3>{category.title}</h3><small>{category.options.length} technologies</small></div>
                                          <div className="technology-options">
                                                {category.options.map((technology) => (
                                                      <div className="technology-option" key={technology.name} title={technology.name}>
                                                            <img loading="lazy" src={technology.img} alt="" />
                                                            <span>{technology.name}</span>
                                                      </div>
                                                ))}
                                          </div>
                                    </article>
                              ))}
                        </div>
                  </div>
            </section>
      );
};

export default Technology;
