<template>
  <div
    class="text-left text-white sm:flex flex-col justify-evenly space-x-10 w-full py-9 items-center"
  >
    <div>
      <img
        src="https://raw.githubusercontent.com/rvaidun/rvaidun.github.io/main/images/myphoto.jpeg"
        alt="Photo of Rahul Vaidun"
        class="rounded-full w-48"
      />
    </div>
    <div class="flex flex-col max-w-2xl space-y-3">
      <h1 class="text-5xl font-bold">Hi! 👋</h1>
      <p class="text-base">
        This website was created by
        <span class="font-bold">Rahul Vaidun</span> I am a 20 year old college
        student from California majoring in Computer Science.
      </p>

      <p class="text-base">
        I created this website as a side project to learn more about Vue.js and
        web development. I also wanted to reverse engineer BeReal's API and
        create a web app that would allow users to view their BeReal data. This
        happens to allow users to also view their friends BeReals without
        posting their own BeReals and screenshot BeReals. This website was
        designed from ground up to work on mobile devices. All the styling is
        done with <span class="font-bold">Tailwind CSS</span>
      </p>
      <p class="text-base">
        I don't have plans on monetizing this site hence there will
        <span class="font-bold">never</span> be ads on this website at least for
        the forseeable future. If you are interested in viewing the source code
        or making your own contributions to BeFake check out our
        <a class="text-blue-600" href="https://github.com/rvaidun/befake"
          >github repository</a
        >
      </p>
    </div>
  </div>
  <div class="flex flex-col items-center text-white py-8">
    <h1 class="text-3xl font-bold">Contact me</h1>
    <div class="flex flex-col items-center space-y-1 text-blue-600">
      <a href="https://www.linkedin.com/in/rahoollv/">Twitter </a>
      <a href="https://www.linkedin.com/in/rahulvaidun/">LinkedIn </a>
      <a href="https://www.github.com/rvaidun/">Github </a>
      <a href="https://www.instagram.com/rahulvaidun/">Instagram </a>
      <!-- email -->
      <a href="mailto:rahul.vaidun@gmail.com">Email</a>
    </div>
  </div>
</template>
