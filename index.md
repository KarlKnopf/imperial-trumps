---
layout: default
title: Home
---

# Welcome to the Intergalactic Society Blog 🚀

Explore our latest transmission logs:

<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a> — {{ post.date | date: "%B %d, %Y" }}
    </li>
  {% endfor %}
</ul>
