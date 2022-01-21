import React, { Component } from 'react';

import { ClubConfig } from "../../../types/ClubConfig";

interface ClubSettingsProps {
    config: ClubConfig
}


export default class ClubSettings extends Component {
  render() {
    return <div><h1>Club Settings</h1></div>;
  }
}
