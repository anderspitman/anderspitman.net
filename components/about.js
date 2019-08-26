const About = () => {
  const dom = document.createElement('div');

  dom.innerHTML = `
    <div id='portrait-container'>
      <div class='portrait'>
        <img src="${config.remooseRoot + '/assets/images/portrait.jpg'}" width="100%" alt="profile portrait">
      </div>
    </div>
    <div class='text-content semi-transparent'>
      <p>
        <strong>Hi there</strong>. My name is Anders Pitman. I am a data
        visualization software engineer. I'm passionate about the power of a good
        visualization to catalyze learning and insight. I'm particularly drawn to
        problems in medicine, education, and social issues. Hans Rosling is my
        hero.
      </p>

      <p>
        You can email me at <strong>anders</strong> at this domain. Here are some
        other useful links:
      </p>

      <section class='contact-links'>
        <a target="_blank" href="https://github.com/anderspitman">GitHub</a>
        <a target="_blank" href="https://stackoverflow.com/users/943814/anderspitman">StackOverflow</a>
        <a target="_blank" href="https://www.linkedin.com/in/anderspitman/">LinkedIn</a>
        <a target="_blank" href="https://twitter.com/anderspitman">Twitter</a>
      </section>

      <!--
      <p>
        Note: The background visualization is actually a bit cooler than it
        looks. The code is pulled live from my public GitHub contributions. You
        can learn more about it
        <a target='_blank' href='/projects/redpill'>here</a>.
      </p>
      -->
    </div>
    <!-- creates space so background visualization continues past content -->
    <div class='spacer'></div>
  `;

  return dom;
};

export {
  About,
};
