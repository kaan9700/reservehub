import React from 'react';
import { Typography } from "antd";

const getResponsiveFontSize = () => {
  const vw = window.innerWidth;

  if(vw <= 600) {
    return '7vw';
  }
  else if(vw >= 1200) {
    return '2.5vw';
  }
  else {
    return '2.5vw';
  }
}

const HeaderText = ( {title} ) => {
  return <Typography.Title level={1} className={'header-text'} style={{ fontSize: getResponsiveFontSize() }}>{title}</Typography.Title>;
};

export default HeaderText;
