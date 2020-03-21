import React, { useContext, Fragment, useEffect, useState } from 'react'
import { Container, Segment, Header, Button, Image } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import RootStoreContext from '../../app/stores/rootStore'
import LoadingComponent from '../../app/layout/LoadingComponent'
import LoginForm from '../user/LoginForm'
import RegisterForm from '../user/RegisterForm'

const Home = () => {
    const { userStore: { isLoggedIn, user, getUser }, commonStore: {token, setAppLoaded}, modalStore: {openModal} } = useContext(RootStoreContext);
    const [isLoaded, setLoading] = useState(true)

   useEffect(() => {
        if(token && !user) {
            getUser().finally(() => {
                setAppLoaded();
                setLoading(false);
            })
        }
        else {
            setLoading(false);
        }
           
   }, [token, setAppLoaded, getUser, user])

   if(isLoaded)
    return <LoadingComponent content="App loading..." />


    return (
        <Segment inverted textAlign='center' vertical className='masthead' >
            <Container text>
                <Header as='h1' inverted>
                    <Image size='massive' src='/assets/logo.png' alt='logo' style={{ marginBottom: 12 }} />
                    Reactivities
                </Header>

                {
                    isLoggedIn && user ? (
                        <Fragment>
                            <Header as='h2' inverted content={`Welcome back ${user.displayName}`} />
                            <Button as={Link} to='/activities' size='huge' inverted>
                                Go to Reactivities
                            </Button>
                        </Fragment>
                    ) : (
                            <Fragment>
                                <Header as='h2' inverted content='Welcome to Reactivities' />
                                <Button onClick={() => openModal(<LoginForm />)} size='huge' inverted>
                                    Login
                                </Button>
                                <Button onClick={() => openModal(<RegisterForm />)}  size='huge' inverted>
                                    Register
                                </Button>
                            </Fragment>
                        )
                }



            </Container>
        </Segment>
    )
}

export default Home
