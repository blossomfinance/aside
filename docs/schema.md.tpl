<% for(let i = 0; i < level; i++){ %>#<% } %> <%= schema.$id %>

<%= schema.title %>

<% if (schema.properties) { %>
<%   Object.keys(schema.properties).forEach(function(key, i) { %>
## <%= key %>
<%     if (schema.properties[key].$ref) { %>
**See: [<%= docFilename(schema.properties[key].$ref) %>](<%= docFilename(schema.properties[key].$ref) %>)**
<%     } else { %>
<%       if (schema.properties[key].oneOf) { %>
**Must match at least one of:**
<%         schema.properties[key].oneOf.forEach(function(subSchema) { %>
<%= renderTemplateForSchema(subSchema, 3) %>
<%         }); %>
<%       } %>
<%       if (schema.properties[key].type) { %>**Type: `<%= schema.properties[key].type %>`**<% } %>
<%= schema.properties[key].title %>
<%       if (schema.properties[key].description) { %><%= schema.properties[key].description %><% } %>
<%     } %>
<%   }); %>
<% } %>
