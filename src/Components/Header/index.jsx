import { Link } from "react-router-dom";


const Header = () => {
    return(
      <>
        <nav className="navbar navbar-expand-lg bg-light container">
          <div className="container-fluid ">
            <a className="navbar-brand" href="#">To-Do-List</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse ml-6" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="/" >Home</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </>
    
    )
}

export default Header;