import React, { Component } from "react";
import { ClubConfig } from "../../types";
import dataUtil from "../../services/data.util";
import { Button } from "antd";

interface BankPaymentInstructionsProps {
    clubConfig: ClubConfig | null;
    targetSemester: any;
}

interface BankPaymentInstructionsState {}

export default class BankPaymentInstructions extends Component<
    BankPaymentInstructionsProps,
    BankPaymentInstructionsState
> {
    copyText = (text: string) => {
        dataUtil.copyText(text);
    };

    render() {
        return (
            <p>
                If paying by Bank Transfer, include your 'NAME' and
                {this.props.targetSemester === "S1"
                    ? ` 'AUMTS1' (for one semester) or AUMTFY (for one year) `
                    : ""}
                {this.props.targetSemester === "FY"
                    ? ` AUMTFY (for one year) `
                    : ""}
                {this.props.targetSemester === "S2"
                    ? ` 'AUMTS2' (for one semester) `
                    : ""}
                {this.props.targetSemester === "SS"
                    ? ` 'AUMTSS' (for summer school) `
                    : ""}
                as the reference. Membership is
                {this.props.targetSemester === "S1"
                    ? ` $${this.props.clubConfig?.semesterOneFee} for the semester or $${this.props.clubConfig?.fullYearFee} for the year `
                    : ""}
                {this.props.targetSemester === "FY"
                    ? ` $${this.props.clubConfig?.fullYearFee} for the year `
                    : ""}
                {this.props.targetSemester === "S2"
                    ? ` $${this.props.clubConfig?.semesterTwoFee} for the semester `
                    : ""}
                {this.props.targetSemester === "SS"
                    ? ` $${this.props.clubConfig?.summerSchoolFee} for summer school `
                    : ""}
                and should be paid with your full name as the reference to:
                {" " + this.props.clubConfig?.bankAccountNumber}
                <Button
                    type="link"
                    onClick={(e) =>
                        this.copyText(
                            `${this.props.clubConfig?.bankAccountNumber}`
                        )
                    }
                >
                    Copy Account Number
                </Button>
            </p>
        );
    }
}
