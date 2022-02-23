import React, { Component } from "react";
import {
    Form,
    Radio,
    Input,
    Button,
    Tooltip,
    message,
    notification,
    Alert,
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import "./JoinForm.css";
import { FormInstance } from "antd/lib/form";
import DataFormatterUtil from "../../../services/data.util";
import { AumtMember, ClubConfig } from "../../../types";
import FirebaseUtil from "../../../services/firebase.util";
import db from "../../../services/db";
import validator from "../../../services/validator";
import PaymentInstructions from "../../utility/PaymentInstructions";

interface JoinFormProps {
    isAdmin: boolean;
    clubConfig: ClubConfig | null;
}

interface JoinFormState {
    currentExperienceInMuayThai: string;
    submitting: boolean;
}

export class JoinForm extends Component<JoinFormProps, JoinFormState> {
    private formRef = React.createRef<FormInstance>();
    private currentYear = new Date().getFullYear();

    private clubSignupSem = this.props.clubConfig?.clubSignupSem;

    private verticalRadioStyle = {
        display: "block",
    };

    private alignInputLayout = {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 },
    };

    constructor(props: JoinFormProps) {
        super(props);
        this.state = {
            currentExperienceInMuayThai: "",
            submitting: false,
        };
    }

    private onSubmitFail = (obj: any) => {
        const { errorFields } = obj;
        if (errorFields && errorFields.length) {
            notification.error({
                message: obj.errorFields[0].errors[0],
                duration: 1.5,
            });
        }
    };

    private onSubmit = (values: any) => {
        const {
            UoaStudent: isUoAStudent,
            interestedInCamp,
            ReturningMember: isReturningMember,
            FirstName: firstName,
            LastName: lastName,
            PreferredName: preferredName = "",
            Experience: initialExperience,
            EmergencyContactName,
            EmergencyContactNumber,
            EmergencyContactRelationship,
            Paid: paid = "No",
            Membership: membership,
            upi,
            studentId,
            email,
            password,
            uid,
            Payment: paymentType,
        } = values;

        const member: string | AumtMember = validator.createAumtMember({
            firstName,
            lastName,
            preferredName,
            email,
            isUoAStudent,
            upi,
            studentId,
            membership,
            initialExperience,
            interestedInCamp,
            paymentType,
            paid,
            timeJoinedMs: new Date().getTime(),
            isReturningMember,
            EmergencyContactName,
            EmergencyContactNumber,
            EmergencyContactRelationship,
        });

        if (typeof member === "string") {
            return message.error({
                content: `Error creating member: ${member}`,
            });
        }

        this.setState({
            ...this.state,
            submitting: true,
        });

        const key = "submitFormMessage";

        if (password) {
            message.loading({ content: "Creating User", key });
            FirebaseUtil.createUser(email, password)
                .then((userCredential) => {
                    const { user } = userCredential;
                    if (!user) {
                        throw new Error(
                            "No user returned from Firebase create"
                        );
                    }
                    return user.uid;
                })
                .then((uid: string) => {
                    message.loading({ content: "Adding to Club", key });
                    return db.setMember(uid, member);
                })
                .then(() => {
                    message.success({
                        content: "You are now part of the club!",
                        key,
                        duration: 5,
                    });
                })
                .catch((err) => {
                    if (err.code === "auth/email-already-in-use") {
                        return message.error({
                            content:
                                "Email already in use. Contact the AUMT committee ",
                            key,
                            duration: 5,
                        });
                    }
                    return message.error({
                        content: err.toString(),
                        key,
                        duration: 5,
                    });
                })
                .finally(() => {
                    this.setState({
                        ...this.state,
                        submitting: false,
                    });
                });
        } else if (uid) {
            message.loading({ content: "Adding to Club", key });
            db.setMember(uid, member)
                .then(() => {
                    message.success({
                        content: "You are now part of the club!",
                        key,
                        duration: 5,
                    });
                })
                .catch((err) => {
                    if (err.code === "auth/email-already-in-use") {
                        return message.error({
                            content:
                                "Email already in use. Contact the AUMT committee ",
                            key,
                            duration: 5,
                        });
                    }
                    return message.error({
                        content: err.toString(),
                        key,
                        duration: 5,
                    });
                })
                .finally(() => {
                    this.setState({
                        ...this.state,
                        submitting: false,
                    });
                });
        } else {
            notification.error({
                message: "No UID or password, somethings very very wrong",
            });
        }
    };

    private copyText = (text: string) => {
        DataFormatterUtil.copyText(text);
    };

    render() {
        return (
            <div className="joinFormContainer">
                {!this.props.isAdmin ? (
                    <div>
                        <h2>
                            AUMT {this.currentYear}
                            <b>
                                {this.clubSignupSem === "S1"
                                    ? " Semester 1 "
                                    : ""}
                                {this.clubSignupSem === "S2"
                                    ? " Semester 2 "
                                    : ""}
                                {this.clubSignupSem === "SS"
                                    ? " Summer School "
                                    : ""}
                            </b>
                            Club Sign-ups
                        </h2>

                        <p>
                            Welcome to AUMT! We look forward to you being a part of our club. 
                            Please fill in the form below to create an account. Your account will enable
                            you to sign up to future training sessions and join events. Please contact us if
                            you have any questions.
                        </p>

                        <h3 className="formSectionHeader">Agreement:</h3>
                        <p>
                            I understand that by filling out and submitting this
                            form, I am partaking in the club activities at my
                            own risk and all injuries sustained to any person or
                            any damage to equipment during the ordinary course
                            of training will not be the responsibility of the
                            club. Any loss of equipment or personal belongings
                            is the sole responsibility of the member and is not
                            the responsibility of the club or training facility.
                        </p>
                    </div>
                ) : (
                    <div>
                        <Alert
                            type="warning"
                            message="NOTE TO ADMIN"
                            description="Adding a member here will only add them to the database and not give them a login (email and password).
                    You must FIRST create an account for them at the Firebase console in the Authentication section and then enter their UID in the form below."
                        />
                    </div>
                )}
                <div className="joinFormEntry">
                    <Form
                        scrollToFirstError
                        ref={this.formRef}
                        onFinishFailed={this.onSubmitFail}
                        onFinish={this.onSubmit}
                    >
                        {!this.props.isAdmin ? (
                            <Form.Item
                                name="Disclaimer"
                                rules={[{ required: true }]}
                                label="Have you read and understood the above agreement?"
                            >
                                <Radio.Group name="DisclaimerRadio">
                                    <Radio value="Yes">Yes</Radio>
                                </Radio.Group>
                            </Form.Item>
                        ) : null}

                        <div>
                            <h3 className="formSectionHeader">Login Details</h3>
                            {!this.props.isAdmin ? (
                                <p>
                                    This is your account to sign in to this site
                                    for trainings and events. Your email here
                                    will be used both as your username for the
                                    account and as a point of contact for club
                                    announcements and invitations. You can reset
                                    your password at any time.
                                </p>
                            ) : null}
                        </div>

                        <Form.Item
                            {...this.alignInputLayout}
                            rules={[{ required: true }]}
                            name="email"
                            label="Email"
                        >
                            <Input className="joinFormInput" type="email" />
                        </Form.Item>

                        {!this.props.isAdmin ? (
                            <Form.Item
                                {...this.alignInputLayout}
                                rules={[{ required: true }]}
                                name="password"
                                label="Password"
                            >
                                <Input.Password className="joinFormInput" />
                            </Form.Item>
                        ) : (
                            <Form.Item
                                {...this.alignInputLayout}
                                rules={[{ required: true }]}
                                name="uid"
                                label="UID"
                                help="Found in the Firebase Authentication section"
                            >
                                <Input
                                    placeholder="See NOTE TO ADMIN"
                                    className="joinFormInput"
                                />
                            </Form.Item>
                        )}

                        <h3 className="formSectionHeader">Personal Details</h3>
                        <Form.Item
                            name="ReturningMember"
                            rules={[{ required: true }]}
                            label="Are you a returning AUMT member? "
                        >
                            <Radio.Group
                                buttonStyle="solid"
                                name="ReturningMemberRadio"
                            >
                                <Radio.Button value={"Yes"}>Yes</Radio.Button>
                                <Radio.Button value={"No"}>No</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            {...this.alignInputLayout}
                            name="FirstName"
                            rules={[{ required: true }]}
                            label="First Name "
                        >
                            <Input className="joinFormInput" />
                        </Form.Item>
                        <Form.Item
                            {...this.alignInputLayout}
                            name="LastName"
                            rules={[{ required: true }]}
                            label="Last Name "
                        >
                            <Input className="joinFormInput" />
                        </Form.Item>
                        <Form.Item
                            {...this.alignInputLayout}
                            name="PreferredName"
                            label="Preferred Name"
                        >
                            <Input
                                className="joinFormInput"
                                placeholder="If different from first name"
                            />
                        </Form.Item>

                        <h3 className="formSectionHeader">
                            University Details
                        </h3>
                        <Form.Item
                            name="UoaStudent"
                            rules={[{ required: true }]}
                            label="Are you a current UoA student? "
                        >
                            <Radio.Group
                                buttonStyle="solid"
                                name="UoaStudentRadio"
                                onChange={(e) => this.forceUpdate()}
                            >
                                <Radio.Button value={"Yes"}>Yes</Radio.Button>
                                <Radio.Button value={"No"}>No</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        {this.formRef.current?.getFieldValue("UoaStudent") !==
                        "No" ? (
                            <div>
                                <Form.Item
                                    {...this.alignInputLayout}
                                    name="upi"
                                    label={
                                        <span>
                                            UPI&nbsp;
                                            <Tooltip title="This is the part before your university email (e.g. jdoe295)">
                                                <QuestionCircleOutlined />
                                            </Tooltip>
                                        </span>
                                    }
                                    rules={[{ required: true }]}
                                >
                                    <Input className="joinFormInput" />
                                </Form.Item>
                                <Form.Item
                                    {...this.alignInputLayout}
                                    name="studentId"
                                    rules={[{ required: true }]}
                                    label="Student Id"
                                >
                                    <Input className="joinFormInput" />
                                </Form.Item>
                            </div>
                        ) : null}

                        <h3 className="formSectionHeader">
                            Emergency Contact Details
                        </h3>
                        <Form.Item
                            {...this.alignInputLayout}
                            rules={[{ required: true }]}
                            name="EmergencyContactName"
                            label="Name"
                        >
                            <Input className="joinFormInput" />
                        </Form.Item>
                        <Form.Item
                            {...this.alignInputLayout}
                            rules={[{ required: true }]}
                            name="EmergencyContactNumber"
                            label="Phone Number"
                        >
                            <Input className="joinFormInput" type="tel" />
                        </Form.Item>
                        <Form.Item
                            {...this.alignInputLayout}
                            rules={[{ required: true }]}
                            name="EmergencyContactRelationship"
                            label="Relationship"
                        >
                            <Input className="joinFormInput" />
                        </Form.Item>

                        <h3 className="formSectionHeader">
                            Muay Thai Experience
                        </h3>
                        <Form.Item
                            rules={[{ required: true }]}
                            name="Experience"
                            label="Experience in Muay Thai"
                        >
                            <Radio.Group
                                name="ExperienceRadio"
                                onChange={(v) =>
                                    this.setState({
                                        ...this.state,
                                        currentExperienceInMuayThai:
                                            v.target.value,
                                    })
                                }
                            >
                                <Radio
                                    style={this.verticalRadioStyle}
                                    value={"None"}
                                >
                                    None
                                </Radio>
                                <Radio
                                    style={this.verticalRadioStyle}
                                    value={"Beginner/Intermediate"}
                                >
                                    Beginner/Intermediate
                                </Radio>
                                <Radio
                                    style={this.verticalRadioStyle}
                                    value={"Advanced"}
                                >
                                    Advanced
                                </Radio>
                                <Radio
                                    style={this.verticalRadioStyle}
                                    value={"Other"}
                                >
                                    Other...
                                    {this.state.currentExperienceInMuayThai ===
                                    "Other" ? (
                                        <Input
                                            className="joinFormInput"
                                            style={{
                                                width: 100,
                                                marginLeft: 10,
                                            }}
                                        />
                                    ) : null}
                                </Radio>
                            </Radio.Group>
                        </Form.Item>

                        <h3 className="formSectionHeader">Camp Interest</h3>
                        <p>
                            Every year AUMT hosts its legendary camp: a few days
                            training and hanging out with fellow members. This will be held at
                            Omori lodge, 22nd to 25th April.
                        </p>
                        <Form.Item
                            name="interestedInCamp"
                            rules={[{ required: true }]}
                            label="Would you be interested in the AUMT camp?"
                        >
                            <Radio.Group
                                buttonStyle="solid"
                                name="interestedInCampRadio"
                            >
                                <Radio.Button value={"Yes"}>Yes</Radio.Button>
                                <Radio.Button value={"No"}>No</Radio.Button>
                            </Radio.Group>
                        </Form.Item>

                        <h3 className="formSectionHeader">Membership Payment</h3>
                        <Form.Item
                            name="Membership"
                            rules={[{ required: true }]}
                            label="Membership Duration"
                        >
                            <Radio.Group
                                buttonStyle="solid"
                                name="MembershipRadio"
                                value={this.props.clubConfig?.clubSignupSem}
                            >
                                {this.props.clubConfig?.clubSignupSem ===
                                "S1" ? (
                                    <>
                                        <Radio.Button value={"S1"}>
                                            Semester 1 Only
                                        </Radio.Button>
                                        <Radio.Button value={"FY"}>
                                            Full Year (Semester 1 and 2)
                                        </Radio.Button>
                                    </>
                                ) : null}

                                {this.props.clubConfig?.clubSignupSem ===
                                "SS" ? (
                                    <Radio.Button value={"SS"}>
                                        Summer School Only
                                    </Radio.Button>
                                ) : null}
                                
                                {this.props.clubConfig?.clubSignupSem ===
                                "S2" ? (
                                    <Radio.Button value={"S2"}>
                                        Semester 2 Only
                                    </Radio.Button>
                                ) : null}
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item
                            name="Payment"
                            rules={[{ required: true }]}
                            label="Payment Type"
                        >
                            <Radio.Group
                                buttonStyle="solid"
                                name="PaymentRadio"
                                onChange={(e) => this.forceUpdate()}
                            >
                                <Radio.Button value={"Bank Transfer"}>
                                    Bank Transfer (Best)
                                </Radio.Button>
                                <Radio.Button value={"Cash"}>Cash</Radio.Button>
                                <Radio.Button value={"Other"}>
                                    Other
                                </Radio.Button>
                            </Radio.Group>
                        </Form.Item>

                        {this.props.isAdmin ? (
                            <Form.Item
                                name="Paid"
                                rules={[{ required: true }]}
                                label="Paid?"
                            >
                                <Radio.Group
                                    buttonStyle="solid"
                                    name="PaidRadio"
                                >
                                    <Radio.Button value={"Yes"}>
                                        Yes
                                    </Radio.Button>
                                    <Radio.Button value={"No"}>No</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                        ) : null}

                        {console.log(
                            this.formRef.current?.getFieldValue("Payment")
                        )}

                        {!this.props.isAdmin &&
                        this.formRef.current?.getFieldValue("Payment") ===
                            "Bank Transfer" ? (
                            <PaymentInstructions
                                clubConfig={this.props.clubConfig}
                                paymentType="Bank Transfer"
                                membershipType={
                                    this.props.clubConfig?.clubSignupSem
                                }
                            />
                        ) : null}

                        {!this.props.isAdmin &&
                        this.formRef.current?.getFieldValue("Payment") ===
                            "Cash" ? (
                            <PaymentInstructions
                                clubConfig={this.props.clubConfig}
                                paymentType="Cash"
                                membershipType={
                                    this.props.clubConfig?.clubSignupSem
                                }
                            />
                        ) : null}

                        {!this.props.isAdmin &&
                        this.formRef.current?.getFieldValue("Payment") ===
                            "Other" ? (
                            <PaymentInstructions
                                clubConfig={this.props.clubConfig}
                                paymentType="Other"
                                membershipType={
                                    this.props.clubConfig?.clubSignupSem
                                }
                            />
                        ) : null}

                        <Form.Item>
                            <Button
                                className="joinFormSubmit"
                                loading={this.state.submitting}
                                block
                                type="primary"
                                htmlType="submit"
                            >
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        );
    }
}
