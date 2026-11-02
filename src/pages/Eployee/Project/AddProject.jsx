
import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import JoditEditor from 'jodit-react';
import { useNavigate, useParams } from 'react-router-dom';
import { base_url } from '../../../layout/Title';
import uploadImage from '../../../Hook/ImageUpload';
import Select from 'react-select';
import { AuthContext } from '../../../context/UseContext/AuthProvider';

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


// const data = [
//       {
//             "category": "Front-End",
//             "technologies": [
//                   { "value": "html", "label": "HTML", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/8/80/HTML5_logo_resized.svg" },
//                   { "value": "css", "label": "CSS", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg" },
//                   { "value": "javascript", "label": "JavaScript", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png" },
//                   { "value": "typescript", "label": "TypeScript", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/f/f5/Typescript.svg" },
//                   { "value": "react", "label": "React", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" },
//                   { "value": "vue", "label": "Vue.js", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg" },
//                   { "value": "angular", "label": "Angular", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/c/cf/Angular_full_color_logo.svg" },
//                   { "value": "svelte", "label": "Svelte", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1b/Svelte_Logo.svg" },
//                   { "value": "preact", "label": "Preact", "imageUrl": "https://logowik.com/content/uploads/images/preact4245.logowik.com.webp" },
//                   { "value": "lit", "label": "Lit", "imageUrl": "https://logowik.com/content/uploads/images/lit1871.logowik.com.webp" },
//                   { "value": "jquery", "label": "jQuery", "imageUrl": "https://upload.wikimedia.org/wikipedia/en/9/9e/JQuery_logo.svg" },
//                   { "value": "backbone", "label": "Backbone", "imageUrl": "https://logowik.com/content/uploads/images/851_backbone.jpg" },
//                   { "value": "ember", "label": "Ember", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/6/66/Ember.js_Logo_and_Mascot.png" },
//                   { "value": "dojo", "label": "Dojo", "imageUrl": "https://upload.wikimedia.org/wikipedia/en/8/8c/Dojo_toolkit_logo.png" },
//                   { "value": "extjs", "label": "Ext JS", "imageUrl": "https://upload.wikimedia.org/wikipedia/en/6/69/Ext_Logo.svg" },
//                   { "value": "tailwindcss", "label": "Tailwind CSS", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" },
//                   { "value": "bootstrap", "label": "Bootstrap", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b2/Bootstrap_logo.svg" },
//                   { "value": "materialui", "label": "Material UI", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/a/af/Material_Design_Logo.svg" },
//                   { "value": "antdesign", "label": "Ant Design", "imageUrl": "https://cdn.worldvectorlogo.com/logos/ant-design-2.svg" },
//                   { "value": "foundation", "label": "Foundation", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/e/ef/Foundation_Logo.png" },
//                   { "value": "semanticui", "label": "Semantic UI", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e5/Semantic_UI_logo.png" },
//                   { "value": "bulma", "label": "Bulma", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9a/Bulma.png" }
//             ]
//       },
//       {
//             "category": "Back-End",
//             "technologies": [
//                   { "value": "nodejs", "label": "Node.js", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" },
//                   { "value": "python", "label": "Python", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" },
//                   { "value": "ruby", "label": "Ruby", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/7/73/Ruby_logo.svg" },
//                   { "value": "php", "label": "PHP", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg" },
//                   { "value": "java", "label": "Java", "imageUrl": "https://upload.wikimedia.org/wikipedia/en/3/30/Java_programming_language_logo.svg" },
//                   { "value": "csharp", "label": "C#", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/4/4f/Csharp_Logo.png" },
//                   { "value": "go", "label": "Go", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/0/05/Go_Logo_Blue.svg" },
//                   { "value": "scala", "label": "Scala", "imageUrl": "https://upload.wikimedia.org/wikipedia/en/8/85/Scala_logo.png" },
//                   { "value": "kotlin", "label": "Kotlin", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/7/74/Kotlin_Icon.png" },
//                   { "value": "elixir", "label": "Elixir", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/92/Elixir_logo.png" },
//                   { "value": "erlang", "label": "Erlang", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/5/59/Erlang-logo.png" },
//                   { "value": "dart", "label": "Dart", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/7/7e/Dart-logo.png" },
//                   { "value": "expressjs", "label": "Express.js", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png" },
//                   { "value": "django", "label": "Django", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/7/75/Django_logo.svg" },
//                   { "value": "ruby_on_rails", "label": "Ruby on Rails", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/6/62/Ruby_On_Rails_Logo.svg" },
//                   { "value": "laravel", "label": "Laravel", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9a/Laravel.svg" },
//                   { "value": "symfony", "label": "Symfony", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Symfony_logo.svg" },
//                   { "value": "spring", "label": "Spring", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/4/44/Spring_Framework_Logo_2018.svg" },
//                   { "value": "aspnet", "label": "ASP.NET", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/0/0e/Microsoft_.NET_logo.png" },
//                   { "value": "flask", "label": "Flask", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/3c/Flask_logo.svg" },
//                   { "value": "pyramid", "label": "Pyramid", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/0/0a/Pylons_project_logo.png" },
//                   { "value": "sinatra", "label": "Sinatra", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/4/4b/Sinatra-logo.svg" },
//                   { "value": "phoenix", "label": "Phoenix", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/7/7e/Phoenix_logo.png" },
//                   { "value": "playframework", "label": "Play Framework", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/4/46/Play_Framework_logo.png" },
//                   { "value": "dropwizard", "label": "Dropwizard", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Dropwizard_Logo.png" },
//                   { "value": "vertx", "label": "Vert.x", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9b/Vert.x_Logo.png" }
//             ]
//       },
//       {
//             "category": "Databases",
//             "technologies": [
//                   { "value": "mysql", "label": "MySQL", "imageUrl": "https://upload.wikimedia.org/wikipedia/en/d/dd/MySQL_logo.svg" },
//                   { "value": "postgresql", "label": "PostgreSQL", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg" },
//                   { "value": "sqlite", "label": "SQLite", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/38/SQLite370.svg" },
//                   { "value": "mongodb", "label": "MongoDB", "imageUrl": "https://logowik.com/content/uploads/images/mongodb9740.logowik.com.webp" },
//                   { "value": "firebase", "label": "Firebase", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/37/Firebase_Logo.svg" },
//                   { "value": "cassandra", "label": "Cassandra", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/5/5e/Cassandra_logo.svg" },
//                   { "value": "redis", "label": "Redis", "imageUrl": "https://upload.wikimedia.org/wikipedia/en/6/6a/Redis_Logo.svg" },
//                   { "value": "couchbase", "label": "Couchbase", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Couchbase_Logo.svg" },
//                   { "value": "neo4j", "label": "Neo4j", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/8/8e/Neo4j_logo.svg" },
//                   { "value": "elasticsearch", "label": "Elasticsearch", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/f/f4/Elasticsearch_logo.svg" }
//             ]
//       },
//       {
//             "category": "Mobile App Development",
//             "technologies": [
//                   { "value": "react_native", "label": "React Native", "imageUrl": "https://w7.pngwing.com/pngs/772/987/png-transparent-react-native-logo-react-native-software-logo-social-media-logo-logo-technology-logo-3d-icon-thumbnail.png" },
//                   { "value": "flutter", "label": "Flutter", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/0/03/Flutter_logo_2021.png" },
//                   { "value": "ionic", "label": "Ionic", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/2/2c/Ionic_Logo.svg" },
//                   { "value": "xamarin", "label": "Xamarin", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/4/43/Xamarin_logo.png" },
//                   { "value": "kotlin_native", "label": "Kotlin/Native", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/7/74/Kotlin_Icon.png" },
//                   { "value": "swift", "label": "Swift", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9f/Swift_logo.svg" },
//                   { "value": "swiftui", "label": "SwiftUI", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/8/8c/SwiftUI_logo.png" }
//             ]
//       },
//       {
//             "category": "UI/UX Design",
//             "technologies": [
//                   { "value": "figma", "label": "Figma", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/31/Figma_logo.png" },
//                   { "value": "adobe_xd", "label": "Adobe XD", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/7/7f/Adobe_XD_logo.png" },
//                   { "value": "sketch", "label": "Sketch", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/1/15/Sketch_Logo.svg" },
//                   { "value": "invision", "label": "InVision", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1c/InVision_Logo.png" },
//                   { "value": "framer", "label": "Framer", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/5/56/Framer_logo.png" },
//                   { "value": "uxpin", "label": "UXPin", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/2/21/UXPin_Logo.png" },
//                   { "value": "zeplin", "label": "Zeplin", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/35/Zeplin_logo.png" },
//                   { "value": "propie", "label": "ProtoPie", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/5/53/ProtoPie_logo.png" }
//             ]
//       },
//       {
//             "category": "Other",
//             "technologies": [
//                   { "value": "git", "label": "Git", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Git-logo.svg" },
//                   { "value": "npm", "label": "npm", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/d/db/Npm-logo.svg" },
//                   { "value": "yarn", "label": "Yarn", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/d/d4/Yarn-logo.svg" },
//                   { "value": "webpack", "label": "Webpack", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/94/Webpack.svg" },
//                   { "value": "babel", "label": "Babel", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/0/02/Babel_Logo.svg" },
//                   { "value": "typescript_compiler", "label": "TypeScript Compiler", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_Logo.svg" },
//                   { "value": "docker", "label": "Docker", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/4/4e/Docker_logo.svg" },
//                   { "value": "kubernetes", "label": "Kubernetes", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/39/Kubernetes_logo_without_workmark.svg" },
//                   { "value": "aws", "label": "AWS", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
//                   { "value": "gcp", "label": "GCP", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/6/67/Google_Cloud_logo.svg" },
//                   { "value": "azure", "label": "Azure", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a8/Microsoft_Azure_Logo.svg" }
//             ]
//       }
// ]

const data = [
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





const AddProject = () => {
      const { user } = useContext(AuthContext);
      const [selectedFile, setSelectedFile] = useState(null);
      const [previewUrl, setPreviewUrl] = useState(null);
      const [fileName, setFileName] = useState('');
      const [loading, setLoading] = useState(false)
      const [selectedTechnologies, setSelectedTechnologies] = useState([]);
      const { url: editUrl } = useParams();
      const isEdit = Boolean(editUrl);
      const [existing, setExisting] = useState(null);
      const [loadError, setLoadError] = useState('');

      useEffect(() => {
            if (!isEdit) return;
            fetch(`${base_url}/project/get-project-by-id?project_id=${encodeURIComponent(editUrl)}`, {
                  headers: { 'content-type': 'application/json', 'author': 'bright_future_soft' },
            })
                  .then(res => res.json())
                  .then(data => {
                        if (data.success) {
                              setExisting(data.data);
                              setSelectedTechnologies(data.data.technologies || []);
                              setPreviewUrl(data.data.image_url || null);
                        } else {
                              setLoadError(data.message || 'Project not found');
                        }
                  })
                  .catch(() => setLoadError('Failed to load project'));
      }, [editUrl, isEdit]);



      // Flatten the data for react-select and include category information
      const options = data.flatMap(category =>
            category.options.map(tech => ({
                  ...tech,
                  category: category.title,
                  value: tech.name,
                  label: (
                        <div
                              className="capitalize flex items-center"
                        >
                              <img
                                    src={tech.img}
                                    alt={tech.name}
                                    className="w-5 h-5 mr-2"
                              />
                              {tech.name}
                        </div>
                  )
            }))
      );


      const handleChange = (selectedOptions) => {
            const selected = selectedOptions.map(option => ({
                  name: option.label.props.children[1], // Extract name from label
                  imageUrl: option.img,
                  category: option.category
            }));
            setSelectedTechnologies(selected);
      };




      const handleFileChange = (event) => {
            const file = event.target.files[0];
            setSelectedFile(file);

            if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                        setPreviewUrl(reader.result);
                  };
                  reader.readAsDataURL(file);
                  setFileName(file.name);
            }
      };

      const navigate = useNavigate()

      const dataSubmit = async (event) => {
            setLoading(true)
            event.preventDefault()
            const form = event.target
            const title = form.title.value
            const projectType = form.projectType.value
            const image = form.photo.files[0]
            const meta_tag = title
            const message = form.message.value
            const photo = image ? await uploadImage(image) : existing?.image_url;
            const formatTitleToURL = (title) => {
                  return title
                        .toLowerCase()
                        .replace(/\s+/g, '_')
                        .replace(/[^\w\-]+/g, '');
            };


            const stripHtmlTags = (html) => {
                  // Create a new DOM parser
                  const doc = new DOMParser().parseFromString(html, 'text/html');
                  const unwantedTags = ['style', 'title'];
                  unwantedTags.forEach(tag => {
                        const elements = doc.getElementsByTagName(tag);
                        while (elements.length) {
                              elements[0].parentNode.removeChild(elements[0]);
                        }
                  });

                  // Get plain text from the document body
                  return doc.body.textContent || '';
            };
            const plainTextMessage = stripHtmlTags(message);

            if (isEdit) {
                  const updated = {
                        project_name: title,
                        description: message,
                        projectType,
                        meta_tag,
                        meta_description: plainTextMessage,
                        image_url: photo,
                        technologies: selectedTechnologies,
                  };
                  fetch(`${base_url}/project/update-project?project_id=${existing._id}`, {
                        method: 'PUT',
                        headers: {
                              'content-type': 'application/json',
                              'author': 'bright_future_soft'
                        },
                        body: JSON.stringify(updated)
                  })
                        .then(res => res.json())
                        .then(data => {
                              setLoading(false)
                              Swal.fire(data.message, ' ', data.success ? 'success' : 'error')
                              if (data.success) navigate('/dashboard/project-management')
                        })
                        .catch(() => { setLoading(false); Swal.fire('Failed to update project', ' ', 'error') })
                  return
            }

            const project = {
                  project_name: title,
                  description: message,
                  projectType,
                  meta_tag,
                  meta_description: plainTextMessage,
                  image_url: photo,
                  url: formatTitleToURL(title),
                  publisher: user,
                  technologies: selectedTechnologies,
                  date: new Date().toDateString(),

            }

            console.log(project, 'project');

            fetch(`${base_url}/project/add-project`, {
                  method: 'POST',
                  headers: {
                        'content-type': 'application/json',
                        'author': 'bright_future_soft'
                  },
                  body: JSON.stringify(project)
            })
                  .then(res => res.json())
                  .then(data => {
                        setLoading(false)
                        if (data.success) {
                              Swal.fire(data.message, ' ', 'success')
                              form.reset()
                              navigate('/dashboard/project-management')
                        }
                  })


      }


      if (isEdit && loadError) return <div className='py-20 text-center text-gray-300'>{loadError}</div>;
      if (isEdit && !existing) return <div className='py-20 text-center text-gray-400'>Loading…</div>;

      const editorConfig = {
            readonly: false,
            theme: "dark",
            height: 320,
            style: { backgroundColor: "#111827", color: "#ffffff" },
            toolbarSticky: false,
            toolbarAdaptive: false,
            toolbarButtonSize: "small",
            buttons: ["bold", "italic", "underline", "|", "ul", "ol", "|", "link", "|", "undo", "redo", "brush", "paragraph"],
            uploader: { insertImageAsBase64URI: true },
            removeButtons: ["source", "video", "fullsize", "about"],
      };
      const selectStyles = {
            control: (b, st) => ({ ...b, backgroundColor: 'rgba(17,24,39,.7)', borderColor: st.isFocused ? 'rgba(59,130,246,.7)' : 'rgba(255,255,255,.1)', borderRadius: 12, minHeight: 44, boxShadow: st.isFocused ? '0 0 0 4px rgba(59,130,246,.15)' : 'none' }),
            menu: (b) => ({ ...b, backgroundColor: '#111827', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, overflow: 'hidden' }),
            option: (b, st) => ({ ...b, backgroundColor: st.isFocused ? 'rgba(255,255,255,.08)' : 'transparent', color: '#e5e7eb' }),
            multiValue: (b) => ({ ...b, backgroundColor: 'rgba(255,255,255,.08)', borderRadius: 999 }),
            multiValueLabel: (b) => ({ ...b, color: '#e5e7eb' }),
            input: (b) => ({ ...b, color: '#fff' }),
            placeholder: (b) => ({ ...b, color: '#6b7280' }),
      };
      const fieldCls = 'w-full rounded-xl border border-white/10 bg-transparent px-3.5 py-2.5 text-sm text-white placeholder-gray-500 transition focus:border-blue-500/70 focus:outline-none focus:ring-4 focus:ring-blue-500/15';
      const cardCls = 'rounded-2xl border border-white/10 p-6';
      const labelCls = 'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400';

      return (
            <main className='w-full p-4 text-white sm:p-8'>
                  <button type='button' onClick={() => navigate('/dashboard/project-management')} className='mb-4 inline-flex items-center gap-1.5 text-sm text-gray-400 transition hover:text-white'>
                        ← Back to projects
                  </button>
                  <h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>{isEdit ? 'Edit project' : 'New project'}</h1>
                  <p className='mt-1 text-sm text-gray-400'>{isEdit ? 'Changes go live on the website as soon as you save.' : 'Add a project to your portfolio.'}</p>

                  <form onSubmit={dataSubmit} className='mt-6 grid gap-6 lg:grid-cols-3'>
                        <div className='space-y-6 lg:col-span-2'>
                              <section className={cardCls}>
                                    <h2 className='mb-4 text-base font-semibold'>Basic info</h2>
                                    <div className='space-y-4'>
                                          <div>
                                                <label className={labelCls} htmlFor='title'>Title</label>
                                                <input required className={fieldCls} placeholder='e.g. Restaurant booking app' type='text' id='title' name='title' defaultValue={existing?.project_name} />
                                          </div>
                                          <div>
                                                <label className={labelCls} htmlFor='projectType'>Project type</label>
                                                <select className={fieldCls} name='projectType' id='projectType' defaultValue={existing?.projectType}>
                                                      <option value='website'>Website</option>
                                                      <option value='app'>Software</option>
                                                      <option value='uiDesign'>UI/UX</option>
                                                </select>
                                          </div>
                                    </div>
                              </section>

                              <section className={cardCls}>
                                    <h2 className='mb-4 text-base font-semibold'>Description</h2>
                                    <div className='overflow-hidden rounded-xl'>
                                          <JoditEditor config={editorConfig} value={existing?.description || ''} name='message' id='message' />
                                    </div>
                              </section>

                              <section className={cardCls}>
                                    <h2 className='mb-1 text-base font-semibold'>Technologies</h2>
                                    <p className='mb-4 text-sm text-gray-400'>Shown as chips on the project page.</p>
                                    <Select
                                          options={options}
                                          isMulti
                                          styles={selectStyles}
                                          value={options.filter(o => selectedTechnologies.some(t => t.name === o.value))}
                                          placeholder='Search and select technologies…'
                                          onChange={handleChange}
                                    />
                              </section>
                        </div>

                        <aside className='space-y-6 lg:sticky lg:top-6 lg:self-start'>
                              <section className={cardCls}>
                                    <h2 className='mb-4 text-base font-semibold'>Cover image</h2>
                                    <label htmlFor='dropzone-file' className='group relative flex aspect-[16/10] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-white/15 text-center transition hover:border-blue-500/60'>
                                          {previewUrl ? (
                                                <>
                                                      <img src={previewUrl} alt='Preview' className='absolute inset-0 h-full w-full object-cover' />
                                                      <span className='absolute inset-0 flex items-center justify-center bg-black/60 text-sm font-semibold opacity-0 transition group-hover:opacity-100'>Change image</span>
                                                </>
                                          ) : (
                                                <div className='px-4'>
                                                      <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' className='mx-auto h-9 w-9 text-gray-500'>
                                                            <path strokeLinecap='round' strokeLinejoin='round' d='M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z' />
                                                      </svg>
                                                      <p className='mt-2 text-sm font-medium text-gray-300'>Click to upload</p>
                                                      <p className='text-xs text-gray-500'>PNG or JPG, 16:10 looks best</p>
                                                </div>
                                          )}
                                          <input required={!isEdit} id='dropzone-file' type='file' accept='image/*' name='photo' className='sr-only' onChange={handleFileChange} />
                                    </label>
                                    {fileName && <p className='mt-2 truncate text-xs text-gray-400'>{fileName}</p>}
                              </section>

                              <button type='submit' disabled={loading} className='w-full rounded-xl bg-gradient-to-b from-blue-500 to-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:from-blue-400 hover:to-blue-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60'>
                                    {loading ? 'Saving…' : isEdit ? 'Update project' : 'Publish project'}
                              </button>
                        </aside>
                  </form>
            </main>
      );
};

export default AddProject;
