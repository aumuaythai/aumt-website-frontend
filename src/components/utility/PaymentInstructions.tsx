import React, { Component } from "react";
import { ClubConfig } from "../../types";
import dataUtil from "../../services/data.util";
import { Button } from "antd";

interface PaymentInstructionsProps {
    clubConfig: ClubConfig | null;
    membershipType: any;
    paymentType: 'Cash' | 'Bank Transfer' | 'Other';
}

interface PaymentInstructionsState {}

export default class PaymentInstructions extends Component<
    PaymentInstructionsProps,
    PaymentInstructionsState
> {
    copyText = (text: string) => {
        dataUtil.copyText(text);
    };

    render() {
        return (
            <div>
                {this.props.paymentType === "Bank Transfer" ? (
                <p>
                    If paying by <b>Bank Transfer</b>, include your 'NAME' and
                    {this.props.membershipType === "S1"
                        ? ` 'AUMTS1' (for one semester) or AUMTFY (for one year) `
                        : ""}
                    {this.props.membershipType === "FY"
                        ? ` 'AUMTFY' (for one year) `
                        : ""}
                    {this.props.membershipType === "S2"
                        ? ` 'AUMTS2' (for one semester) `
                        : ""}
                    {this.props.membershipType === "SS"
                        ? ` 'AUMTSS' (for summer school) `
                        : ""}
                    as the reference. Membership is
                    {this.props.membershipType === "S1"
                        ? ` $${this.props.clubConfig?.semesterOneFee} for the semester or $${this.props.clubConfig?.fullYearFee} for the year `
                        : ""}
                    {this.props.membershipType === "FY"
                        ? ` $${this.props.clubConfig?.fullYearFee} for the year `
                        : ""}
                    {this.props.membershipType === "S2"
                        ? ` $${this.props.clubConfig?.semesterTwoFee} for the semester `
                        : ""}
                    {this.props.membershipType === "SS"
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
                ) : null}

                {this.props.paymentType === "Cash" ? (
                <p>
                    If paying by <b>Cash</b>, please contact us via our Facebook or Email. We will sign
                    you up manually to the first training session of your choice. There you can pay 
                    cash to one of our friendly execs. Once we process your cash payment, you 
                    will unlock access to future trainings and signup by yourself. Membership is
                    {this.props.membershipType === "S1"
                            ? ` $${this.props.clubConfig?.semesterOneFee} for the semester or $${this.props.clubConfig?.fullYearFee} for the year `
                            : ""}
                    {this.props.membershipType === "FY"
                        ? ` $${this.props.clubConfig?.fullYearFee} for the year `
                        : ""}
                    {this.props.membershipType === "S2"
                        ? ` $${this.props.clubConfig?.semesterTwoFee} for the semester `
                        : ""}
                    {this.props.membershipType === "SS"
                        ? ` $${this.props.clubConfig?.summerSchoolFee} for summer school `
                        : ""}.    
                </p>
                ) : null}

                {this.props.paymentType === "Other" ? (
                <p>
                    If paying by <b>Other</b> methods, please contact us via our Facebook or Email,
                    so we can discuss your method of payment.
                </p>
                ) : null}
                    
            </div>
            
        );
    }
}
