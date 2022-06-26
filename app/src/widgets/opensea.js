export default {
  name: 'opensea',
  template,
  script,
  code: {
    preRender
  }
}

function template() {
  return `
<h2 class="text-3xl my-8">My NFTs</h2>
<div class="carousel rounded-box w-full">
  {{#assets}}
    <div class="carosel-item">
      <div class="card w-96 h-full">
        <figure><img src={{image_url}} alt={{name}} /></figure>
        <div class="card-body">
          <h2 class="card-title">{{name}}</h2>
          <p>{{description}}</p>
          <div class="card-actions justify-end">
            <a
              href={{permalink}}
              target="_blank"
              class="btn btn-primary">View</a
            >
          </div>
        </div>
      </div>
    </div>
  {{/assets}}
</div>
  `
}

async function preRender(data) {
  const { assets } = await fetch(`https://api.opensea.io/api/v1/assets?owner=${data.address}`)
    .then(res => res.json())
  return { assets }
}

function script() {
  return ''
}