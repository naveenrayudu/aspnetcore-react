import React from "react";
import { Menu, Container, Button } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { NavLink } from "react-router-dom";


const Navbar: React.FC = () => {
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
      </Container>
    </Menu>
  );
};

export default observer(Navbar);
// onClick={showCreateActivity}