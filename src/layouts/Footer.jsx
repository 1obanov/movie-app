function Footer() {
  return (
    <footer>
      <div className="container">
        <a href="" className="logo">
          MOVIE <span>app</span>
        </a>
        <div className="copyright">
          <p>
            © {new Date().getFullYear()} All rights reserved. Created by
            <a
              className=""
              href="https://www.linkedin.com/in/ihor-lobanov/"
              target="_blank"
            >
              Ihor Lobanov.
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
