<script>
  import isEmpty from "ramda/src/isEmpty";
  export let profile;
  export let icon_repo = "https://social-icons.arweave.dev";
</script>

<div class="h-[700px] w-full">
  <div
    style="background-image: url({profile.background})"
    class="bg-cover bg-no-repeat w-full h-[460px] mb-[50px]"
  >
    <div class="w-full h-full flex flex-col justify-between relative">
      <ul class="w-full flex flex-row-reverse p-5">
        {#if profile.links.facebook}
          <li>
            <a
              href="https://facebook.com/{profile.links.facebook}"
              target="_blank"
              rel="noreferrer"
            >
              <button
                style="
            background-image: url({icon_repo}/facebook-icon.png);
          "
                class="w-[94px] h-[94px] m-5 rounded-xl bg-cover bg-no-repeat"
              />
            </a>
          </li>
        {/if}
        {#if profile.links.linkedin}
          <li>
            <a
              href="https://www.linkedin.com/in/{profile.links.linkedin}"
              target="_blank"
              rel="noreferrer"
            >
              <button
                style="
            background-image: url({icon_repo}/linkedin-icon.png);
          "
                class="w-[94px] h-[94px] m-5 rounded-xl bg-cover bg-no-repeat"
              />
            </a>
          </li>
        {/if}
        {#if profile.links.github}
          <li>
            <a
              href="https://github.com/{profile.links.github}"
              target="_blank"
              rel="noreferrer"
            >
              <button
                style="
            background-image: url({icon_repo}/github-icon.png);
          "
                class="w-[94px] h-[94px] m-5 rounded-xl bg-cover bg-no-repeat"
              />
            </a>
          </li>
        {/if}
        {#if profile.links.discord}
          <li>
            <a
              href="https://discord.com/users/{profile.links.discord}"
              target="_blank"
              rel="noreferrer"
            >
              <button
                style="
            background-image: url({icon_repo}/discord-icon.png);
          "
                class="w-[94px] h-[94px] m-5 rounded-xl bg-cover bg-no-repeat"
              />
            </a>
          </li>
        {/if}
        {#if profile.links.twitch}
          <li>
            <a
              href="https://twitch.com/{profile.links.twitch}"
              target="_blank"
              rel="noreferrer"
            >
              <button
                style="
            background-image: url({icon_repo}/twitch-icon.png);
          "
                class="w-[94px] h-[94px] m-5 rounded-xl bg-cover bg-no-repeat"
              />
            </a>
          </li>
        {/if}
        {#if !isEmpty(profile.links.instagram)}
          <li>
            <a
              href="https://instagram.com/{profile.links.instagram}"
              target="_blank"
              rel="noreferrer"
            >
              <button
                style="
            background-image: url({icon_repo}/instagram-icon.png);
          "
                class="w-[94px] h-[94px] m-5 rounded-xl bg-cover bg-no-repeat"
              />
            </a>
          </li>
        {/if}
        {#if profile.links.youtube}
          <li>
            <a
              href="https://youtube.com/c/{profile.links.youtube}"
              target="_blank"
              rel="noreferrer"
            >
              <button
                style="
            background-image: url({icon_repo}/youtube-icon.png);
          "
                class="w-[94px] h-[94px] m-5 rounded-xl bg-cover bg-no-repeat"
              />
            </a>
          </li>
        {/if}
        {#if profile.links.twitter}
          <li>
            <a
              href="https://twitter.com/{profile.links.twitter}"
              target="_blank"
              rel="noreferrer"
            >
              <button
                style="
            background-image: url({icon_repo}/twitter-icon.png);
          "
                class="w-[94px] h-[94px] m-5 rounded-xl bg-cover bg-no-repeat"
              />
            </a>
          </li>
        {/if}
      </ul>
      <div class="w-full flex m-5 absolute top-[360px] left-0">
        <img
          alt="avatar"
          src={profile.avatar}
          class="ml-5 mr-5 shadow-xl rounded-full border-4 max-w-[265px] bg-base-300"
        />
        <div class="flex flex-col justify-center">
          <p class="m-1 text-3xl tracking-tight text-base-600">
            {profile.name}
          </p>
          <p class="m-1 text-xl text-base-600">{profile.bio}</p>
        </div>
      </div>
    </div>
  </div>
</div>
