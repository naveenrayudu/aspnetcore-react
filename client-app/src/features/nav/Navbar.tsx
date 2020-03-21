import React, { useContext } from "react";
import { Menu, Container, Button, Dropdown, Image } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { NavLink, Link } from "react-router-dom";
import RootStoreContext from "../../app/stores/rootStore";


const Navbar: React.FC = () => {
  const {userStore: {user, logout}} = useContext(RootStoreContext)


  return (
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item header exact as={NavLink} to='/'>
          <img src="/assets/logo.png" alt="logo" style={{ marginRight: '1em' }} />
          Reactivities
        </Menu.Item>
        <Menu.Item name="Activities" as={NavLink} to='/activities' />
        <Menu.Item as={NavLink} to='/createActivity'>
          <Button positive>Create Activity</Button>
        </Menu.Item>

        {
          user && <Menu.Item position='right'>
          <Image avatar spaced='right' src={user.image || '/assets/user.png'} />
          <Dropdown pointing='top left' text={user.displayName}>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to={`/profile/username`} text='My profile' icon='user'/>
              <Dropdown.Item onClick={logout} text='Logout' icon='power' />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>
        }
      </Container>
    </Menu>
  );
};

export default observer(Navbar);
// onClick={showCreateActivity}