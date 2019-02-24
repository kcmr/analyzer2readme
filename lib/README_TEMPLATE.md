{%- for item in data %}
# {{item.name}} <small>{{item.type}}</small>

{%- if item.properties %}
## Properties

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
      <th>Default</th>
    </tr>
  </thead>

  <tbody>
    {%- for property in item.properties %}
    <tr>
      <td><code>{{property.name}}</code></td>
      <td><code>{{property.type}}</code></td>
      <td>{{property.description}}</td>
      <td>{{unquote(property.defaultValue)}}</td>
    </tr>
    {%- endfor %}
  </tbody>
</table>
{%- endif %}

{%- if item.methods %}
## Methods

{%- for method in item.methods %}

### {{method.name}} {% if method.return %} => <code>{{method.return.type}}</code> {{method.return.desc}} {% endif %}

{{method.description}}

{%- endfor %}


{%- endif %}

{%- if item.events %}
## Events

{%- endif %}

{%- endfor %}
