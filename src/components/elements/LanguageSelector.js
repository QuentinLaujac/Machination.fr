import React from 'react'
import translator from '../../config.translator';
import { Radio, Space } from 'antd';

const LanguageSelector = ({ t }) => {

  const changeLanguage = (event) => {
    translator.changeLanguage(event.target.value)
  }

  return (
    <Radio.Group defaultValue="fr" onChange={changeLanguage} style={{ marginTop: 16, marginLeft: 16 }}>
      <Space size={"middle"}>
        <Radio.Button value="fr">Français</Radio.Button>
        <Radio.Button value="en">English</Radio.Button>
      </Space>
    </Radio.Group>
  )
}

export default LanguageSelector;
