---
permalink: /index.html
title: ' Eleventy Excellent'
description: 'Eleventy starter using modern CSS, fluid type, fluid spacing, flexible layout and progressive enhancement.'
layout: 'home'
---

<ul>
  {% for item in spotify.playlist %}
<figure>
  <figcaption>Listen to {{ item.track.name }}:</figcaption>
  <audio controls src="{{ item.track.preview_url }}">
    <a href="{{ item.track.preview_url }}"> Download audio </a>
  </audio>
</figure>

<ul>
{% for artist in item.track.artists %}
{{ artist.name }}
{% endfor %}

{% endfor %}

</ul>

## item | dump

{{ spotify | dump }}

{% for item in spotify.track %}

{{ item | dump }}

{{ item.album }}

{% endfor %}
