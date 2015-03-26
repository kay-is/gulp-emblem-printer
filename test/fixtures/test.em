nav.navbar.navbar-default
  .container-fluid
    .navbar-header
      button.navbar-toggle.collapsed type="button"
        span.icon-bar
        span.icon-bar
        span.icon-bar
      link-to 'projects' class="navbar-brand" | write.docs

    .collapse.navbar-collapse
      ul.nav.navbar-nav.navbar-right
        li: link-to 'auth' | Auth
        li: link-to 'editor' | Editor
        li: link-to 'shop' | Shop

.container-fluid
  = outlet