<% for (let i = 0; i < level; i++){ %>#<% } %> <%= schema.$id || schemaFilenameToIdOrEmpty(schemaFilename) || schema.title %>

<% if (schema.$id || schemaFilename) { %><%= schema.title %><% } %>

<% if (schemaFilename) { %>[View the JSON schema](../dist/schemas/<%= schemaFilename %>)<% } %>

<% if (schema.properties) { %>
<%   Object.keys(schema.properties).forEach(function(key, i) { %>
<%     for (let i = 0; i < level + 1; i++) { %>#<% } %> <%= key %>
<%     if (schema.properties[key].$ref) { %>
**See: [<%= docFilename(schema.properties[key].$ref) %>](<%= docFilename(schema.properties[key].$ref) %>)**
<%     } else { %>
<%       if (schema.properties[key].allOf) { %>
<%         for (let i = 0; i < level + 2; i++) { %>#<% } %> All Of

Must match ALL of the following schemas:
<%         schema.properties[key].oneOf.forEach(function(subSchema) { %>
<%           if (subSchema.$ref) { %>
<%= renderTemplateForSchemaRef({ ref: subSchema.$ref, level: level + 3 }) %>
<%           } else { %>
<%= renderTemplateForSchema({ schema: subSchema, level: level + 3 }) %>
<%           } }); } if (schema.properties[key].oneOf) { %>
<%         for(let i = 0; i < level + 2; i++) { %>#<% } %> One Of

Must match exactly one of any of the following schemas:
<%         schema.properties[key].oneOf.forEach(function(subSchema) { %>
<%           if (subSchema.$ref) { %>
<%= renderTemplateForSchemaRef({ ref: subSchema.$ref, level: level + 3 }) %>
<%           } else { %>
<%= renderTemplateForSchema({ schema: subSchema, level: level + 3 }) %>
<%           } }); } if (schema.properties[key].anyOf) { %>
<%         for (let i = 0; i < level + 2; i++) { %>#<% } %>Any Of

Must match at least one or more of the following schemas:
<%         schema.properties[key].oneOf.forEach(function(subSchema) { %>
<%           if (subSchema.$ref) { %>
<%= renderTemplateForSchemaRef({ ref: subSchema.$ref, level: level + 3 }) %>
<%           } else { %>
<%= renderTemplateForSchema({ schema: subSchema, level: level + 3 }) %>
<%           } }); } %>
<%       if (schema.properties[key].type) { %>**Type: `<%= schema.properties[key].type %>`**<% } %>
<%= schema.properties[key].title %>
<%       if (schema.properties[key].description) { %><%= schema.properties[key].description %><% } %>
<%     } }); %><!-- END of schema.properties.forEach -->
<%   if (schema.allOf) { %>
<%     for(let i = 0; i < level + 1; i++) { %>#<% } %>All Of

Must match ALL of the following schemas:
<%     schema.oneOf.forEach(function(subSchema) { %>
<%       if (subSchema.$ref) { %>
<%= renderTemplateForSchemaRef({ ref: subSchema.$ref, level: level + 2 }) %>
<%       } else { %>
<%= renderTemplateForSchema({ schema: subSchema, level: level + 2 }) %>
<%       } %>
<%     }); %>
<%   } if (schema.oneOf) { %>
<%     for(let i = 0; i < level + 1; i++) { %>#<% } %>One Of

Must match exactly one of any of the following schemas:
<%     schema.oneOf.forEach(function(subSchema) { %>
<%       if (subSchema.$ref) { %>
<%= renderTemplateForSchemaRef({ ref: subSchema.$ref, level: level + 2 }) %>
<%       } else { %>
<%= renderTemplateForSchema({ schema: subSchema, level: level + 2 }) %>
<%       } %>
<%     }); %>
<%   } if (schema.anyOf) { %>
<%     for(let i = 0; i < level + 1; i++) { %>#<% } %>Any Of

Must match at least one or more of the following schemas:
<%     schema.oneOf.forEach(function(subSchema) { %>
<%       if (subSchema.$ref) { %>
<%= renderTemplateForSchemaRef({ ref: subSchema.$ref, level: level + 2 }) %>
<%       } else { %>
<%= renderTemplateForSchema({ schema: subSchema, level: level + 2 }) %>
<%       } %>
<%     }); %>
<%   } %>
<% } %>
