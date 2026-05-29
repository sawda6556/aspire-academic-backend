"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectLevel = exports.SubjectCategory = exports.ResourceStatus = exports.DbsStatus = exports.BookingStatus = exports.VerificationStatus = exports.Gender = exports.UserType = void 0;
var UserType;
(function (UserType) {
    UserType["TUTOR"] = "TUTOR";
    UserType["PARENT"] = "PARENT";
    UserType["STUDENT"] = "STUDENT";
    UserType["ADMIN"] = "ADMIN";
})(UserType || (exports.UserType = UserType = {}));
var Gender;
(function (Gender) {
    Gender["MALE"] = "MALE";
    Gender["FEMALE"] = "FEMALE";
})(Gender || (exports.Gender = Gender = {}));
var VerificationStatus;
(function (VerificationStatus) {
    VerificationStatus["PENDING"] = "PENDING";
    VerificationStatus["APPROVED"] = "APPROVED";
    VerificationStatus["REJECTED"] = "REJECTED";
})(VerificationStatus || (exports.VerificationStatus = VerificationStatus = {}));
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING"] = "PENDING";
    BookingStatus["CONFIRMED"] = "CONFIRMED";
    BookingStatus["CANCELLED"] = "CANCELLED";
    BookingStatus["COMPLETED"] = "COMPLETED";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
var DbsStatus;
(function (DbsStatus) {
    DbsStatus["PENDING"] = "PENDING";
    DbsStatus["VERIFIED"] = "VERIFIED";
    DbsStatus["REQUIRED"] = "REQUIRED";
    DbsStatus["REJECTED"] = "REJECTED";
})(DbsStatus || (exports.DbsStatus = DbsStatus = {}));
var ResourceStatus;
(function (ResourceStatus) {
    ResourceStatus["DRAFT"] = "DRAFT";
    ResourceStatus["PUBLISHED"] = "PUBLISHED";
    ResourceStatus["ARCHIVED"] = "ARCHIVED";
})(ResourceStatus || (exports.ResourceStatus = ResourceStatus = {}));
var SubjectCategory;
(function (SubjectCategory) {
    SubjectCategory["ACADEMIC"] = "Academic";
    SubjectCategory["PRIMARY"] = "Primary School";
    SubjectCategory["SECONDARY"] = "Secondary School (GCSE)";
    SubjectCategory["A_LEVEL"] = "A-Level / Advanced";
    SubjectCategory["ISLAMIC"] = "Islamic Studies";
    SubjectCategory["LANGUAGES"] = "Languages";
    SubjectCategory["UNIVERSITY"] = "University & Adult Learning";
    SubjectCategory["SKILLS"] = "Skills & Development";
    SubjectCategory["SPECIAL_SUPPORT"] = "Special Support";
})(SubjectCategory || (exports.SubjectCategory = SubjectCategory = {}));
var SubjectLevel;
(function (SubjectLevel) {
    SubjectLevel["KS1"] = "KS1";
    SubjectLevel["KS2"] = "KS2";
    SubjectLevel["KS3"] = "KS3";
    SubjectLevel["GCSE"] = "GCSE";
    SubjectLevel["A_LEVEL"] = "A-Level";
    SubjectLevel["UNIVERSITY"] = "University";
    SubjectLevel["ADULT"] = "Adult";
    SubjectLevel["GENERAL"] = "General";
})(SubjectLevel || (exports.SubjectLevel = SubjectLevel = {}));
//# sourceMappingURL=enums.js.map