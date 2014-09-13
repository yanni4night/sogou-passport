{%extends "common/parent.tpl"%}


{%block top%}
<style>
    .content{
        width: 1000px;
        margin: 0 auto;
    }
</style>
{%endblock%}

{%block content%}
{%set menuIndex=7%}
{%include "common/menu.tpl"%}
<div class="content"><%=content%></div>
{%endblock%}