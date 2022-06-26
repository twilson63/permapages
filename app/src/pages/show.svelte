<script>
  const html = localStorage.getItem("html");
  const div = document.createElement("div");
  div.innerHTML = html;
  document.body.appendChild(div);
</script>
