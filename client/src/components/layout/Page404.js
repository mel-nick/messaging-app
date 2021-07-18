import React, {Fragment} from 'react'
import { Link } from 'react-router-dom'


const Page404 = () => {
    return (
        <Fragment>
            <h1 className="x-large text-primary">
                <i className="fas fa-exclamation-triangle"></i> Page Not Found </h1>
                <p className="large">
                    Sorry, this page doesn't exist
                </p>
                <Link to ={'/'} className="btn btn-primary">
                Go back
                </Link>

           
        </Fragment>
    )
}
export default Page404
