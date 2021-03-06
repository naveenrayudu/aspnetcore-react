import React, { useContext } from 'react'
import { Modal } from 'semantic-ui-react'
import RootStoreContext from '../../stores/rootStore'
import { observer } from 'mobx-react-lite'


const ModalContainer = () => {
    const {modalStore: {modal: {open, content}, closeModal}} = useContext(RootStoreContext)
    return (
        <Modal open={open} onClose={closeModal} size='mini'>
            <Modal.Content>
               {content}
            </Modal.Content>
        </Modal>
    )
}

export default observer(ModalContainer)
