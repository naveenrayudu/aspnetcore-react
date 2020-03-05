import React from 'react';
import { Segment, Button, Header, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <Segment placeholder style={{
            fontSize: '1.6rem'
        }}>
            <Header icon>
                <Icon name='search' />
                Oops - we've looked everywhere but couldn't find this.
            </Header>
            <Segment.Inline style={{
                margin: '1.5rem 0',
                display: 'inline-block'
            }}>
                <Button as={Link} to='/activities' primary style={{
                    fontSize: '1.4rem',
                    maxWidth: '100%'
                }}>
                    Return to Activities page
                </Button>
            </Segment.Inline>
        </Segment>
    );
};

export default NotFound;