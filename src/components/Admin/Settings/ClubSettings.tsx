import React, { Component } from "react";

import { Button, InputNumber, notification, List, Radio, Switch } from "antd";

import { ClubConfig } from "../../../types/ClubConfig";

import db from "../../../services/db";

import "./ClubSettings.css";

interface ClubSettingsProps {}

interface ClubSettingsState {
	summerSchoolFee: number
	semesterOneFee: number
	semesterTwoFee: number
	fullYearFee: number
	clubSignupSem: '' | 'S1' | 'S2' | 'SS'
	clubSignupStatus: '' | 'open' | 'closed'
	bankAccountNumber: string
    loading: boolean;
}

export default class ClubSettings extends Component<
    ClubSettingsProps,
    ClubSettingsState
> {
    constructor(props: ClubSettingsProps) {
        super(props);
        this.state = {
            ...this.state,
            loading: true,
        };
    }

    componentDidMount = () => {
        db.getClubConfig().then((clubConfig) => {
            console.log(clubConfig);
            this.setState({
                ...this.state,
                ...clubConfig,
                loading: false,
            });
        });
    };

	onSignupSemChange = (sem: 'S1' | 'S2' | 'SS') => {
		console.log(sem);
	}

	clubSignupStatusChange = (checked: boolean) => {
		console.log(checked);
	}

	summerSchoolFeeChange = (price: any) => {
		console.log(price);
	}

    render() {
        return (
            <div className="clubSettingsContainer">
                <h1>Club Settings</h1>

                <List
                    bordered
                    header={<h1>Memberhip Prices</h1>}
                    className={"listContainer"}
                >
                    <List.Item>
						<span>Summer School</span>
						<InputNumber defaultValue={this.state.summerSchoolFee} onChange={this.summerSchoolFeeChange}/>
					</List.Item>
					<List.Item>
						<span>Semester 1</span>
						<InputNumber defaultValue={this.state.semesterOneFee} onChange={this.summerSchoolFeeChange}/>
					</List.Item>
					<List.Item>
						<span>Semester 2</span>
						<InputNumber defaultValue={this.state.semesterTwoFee} onChange={this.summerSchoolFeeChange}/>
					</List.Item>
					<List.Item>
						<span>Full Year</span>
						<InputNumber defaultValue={this.state.fullYearFee} onChange={this.summerSchoolFeeChange}/>
					</List.Item>
                    
				</List>
				
                <List
                    bordered
                    header={<h1>Join Form</h1>}
                    className={"listContainer"}
                >
                    <List.Item>
						<span>Status</span> 
						<Switch defaultChecked={true} onChange={this.clubSignupStatusChange}/>
					</List.Item>
                    <List.Item>
						<span>Semester</span>
						<Radio.Group value={this.state.clubSignupSem} onChange={e => this.onSignupSemChange(e.target.value) }>
							<Radio.Button value='S1'>Sem 1</Radio.Button>
							<Radio.Button value='S2'>Sem 2</Radio.Button>
							<Radio.Button value='SS'>Summer School</Radio.Button>
                        </Radio.Group></List.Item>
                </List>
            </div>
        );
    }
}
