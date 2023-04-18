<template>
  <div class="flex m-10 justify-around">
    <div class="flex-col items-center">
      <div class="flex flex-col max-w-2xl space-y-3 items-center">
        <img
          src="https://raw.githubusercontent.com/rvaidun/rvaidun.github.io/main/images/myphoto.jpeg"
          alt="Photo of Rahul Vaidun"
          class="rounded-full w-48" />
        <h1 class="text-5xl font-bold">Hi! 👋</h1>
        <p class="text-base">
          This website was created by
          <span class="font-bold">Rahul Vaidun</span> I am a 20 year old college
          student from California majoring in Computer Science.
        </p>

        <p class="text-base">
          I created this website as a side project to learn more about Vue.js
          and web development. I also wanted to reverse engineer BeReal's API
          and create a web app that would allow users to view their BeReal data.
          This happens to allow users to also view their friends BeReals without
          posting their own BeReals and screenshot BeReals. This website was
          designed from ground up to work on mobile devices. All the styling is
          done with <span class="font-bold">Tailwind CSS</span>
        </p>
        <p class="text-base">
          I don't have plans on monetizing this site hence there will
          <span class="font-bold">never</span> be ads on this website at least
          for the forseeable future. However I will happily accept
          <span class="font-bold text-red-600"
            ><a href="https://ko-fi.com/rahulvaidun">donations</a></span
          >
          🤑🥰❤️. If you are interested in viewing the source code or making
          your own contributions to BeFake check out our
          <a class="text-blue-600" href="https://github.com/rvaidun/befake"
            >github repository</a
          >
        </p>
        <div class="flex flex-col items-center text-white">
          <h1 class="text-3xl font-bold">Contact me</h1>
          <div class="flex flex-col items-center space-y-1 text-blue-600">
            <a href="https://www.twitter.com/rahulvaidun/">Twitter </a>
            <a href="https://www.linkedin.com/in/rahulvaidun/">LinkedIn </a>
            <a href="https://www.github.com/rvaidun/">Github </a>
            <a href="https://www.instagram.com/rahulvaidun/">Instagram </a>
            <!-- email -->
            <a href="mailto:rahul.vaidun@gmail.com">Email</a>
            <a href="https://ko-fi.com/rahulvaidun" class="font-bold"
              >Donation</a
            >
          </div>
        </div>
      </div>
      <div class="pt-10 flex flex-col items-center">
        <h1 class="text-3xl font-bold">Contributors:</h1>
        <div class="flex items-center flex-col">
          <a
            class="text-green-600 text-xl underline"
            href="https://github.com/xKRISTOFx"
            >xKRISTOFx</a
          >
          <div class="pt-2 flex flex-col items-center">
            <!-- place in spans text to look good:Student at Technikum Nowoczesnych Technologii, Kleszczów, Poland I made numerous improvements to the application, improved selection of countries, responding to all bereals at once and many other minor ones. Contact Click on my green nickname -->
            <p>
              Student at Technikum Nowoczesnych Technologii, Kleszczów, Poland
            </p>
            <p>
              I made numerous improvements to the application, improved
              selection of countries,
            </p>
            <p>
              implemented responding to all bereals at once and many other minor
              ones.
            </p>
            <p>Contact:</p>
            <p>⬆️Click on my green nickname⬆️</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
