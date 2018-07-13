<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1" import="org.uniof.manchester.dropbox.utilities.User"%>
<html>
<head><title>Home - Web File Browser</title></head>
<body>
<% User user = (User) request.getAttribute("user");  
System.out.println("Usuario en JSP ::" + user.getUsername());
String userName = user.getUsername();
System.out.println("Token en JSP ::" + user.getDropboxAccessToken());
%>
<h2>User: <%=userName%></h2>
	<% 
	  if (user.getDropboxAccessToken() != null) {
	%>  
		  <p>Linked to your Dropbox account <% user.getDropboxAccessToken(); %>, 
          <form action="${pageContext.request.contextPath}/dropbox-unlink" method='POST'>
          <input type='submit' value='Unlink Dropbox account' />
          </form>
          </p>
          <p><a href='/DropBoxMetaRemover/browse'>Browse your Dropbox files</a></p>
	<% 	  
	  } else {
		  // They haven't linked their Dropbox account.  Display the "Link" form.
    %>
   		   <p><form action="${pageContext.request.contextPath}/dropbox-auth-start" method='POST'>
            <input type='submit' value='Link to your Dropbox account' />
            </form></p>
	<% 	  
	  }
    // Log out form.
    %>
        <p><form action="${pageContext.request.contextPath}/logout" method='POST'>
        <input type='submit' value='Logout' />
        </form></p>
</body>
</html>
        