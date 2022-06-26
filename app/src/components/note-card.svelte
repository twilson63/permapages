<script>
  import { formatDistance } from "date-fns";

  export let id, title, description, topic, timestamp;
</script>

<div class="card bg-base-100 shadow-xl">
  <div class="card-body">
    <div class="flex">
      <h2 class="card-title flex-1">{title}</h2>
      <div class="flex-none">
        <div class="flex">
          <p class="">
            <a class="underline" href={`/topics/${topic}`}
              >{topic.length > 0 ? `#${topic}` : ""}</a
            >
          </p>
        </div>
      </div>
    </div>
    <p>{description || ""}</p>
    <div class="card-actions justify-end">
      <p class="mt-4">
        {formatDistance(new Date(timestamp), new Date(), { addSuffix: true })}
      </p>
      <a class="btn btn-primary" href="/notes/{id}">View</a>
    </div>
  </div>
</div>
