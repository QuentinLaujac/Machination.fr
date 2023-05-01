import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import i18n from '../../config.translator';
import * as errorTypes from '../../errors/errorTypes';
import { history } from '../../routers/AppRouter';


const { confirm } = Modal;

const handleOk = () => {
    window.location.reload()
}

const handleCancel = () => {
    history.push({ pathname: '/lobby' })
}

const showModal = (title, content, cancelContent, okContent) => {
    return confirm({
        title: title,
        icon: <ExclamationCircleOutlined />,
        content: content,
        okText: okContent,
        okType: 'danger',
        cancelText: cancelContent,
        onOk() {
            handleOk();
        },
        onCancel() {
            handleCancel();
        },
    });
}

const ModalLostConnection = (error) => {
    switch (error) {
        case errorTypes.UNABLE_TO_INITIALIZE_SOCKET:
            return showModal(i18n.t('ModalConnectionError_connectionError'), i18n.t('ModalConnectionError_unableToInitializeSocket'), i18n.t('ModalConnectionError_goHome'), i18n.t('ModalConnectionError_refresh'));
        case errorTypes.LOST_CONNECTION:
            return showModal(i18n.t('ModalConnectionError_connectionError'), i18n.t('ModalConnectionError_lostConnectionError'), i18n.t('ModalConnectionError_goHome'), i18n.t('ModalConnectionError_refresh'));
        default:
            return;
    }
}


export default ModalLostConnection;