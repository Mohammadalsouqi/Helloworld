import Foundation

struct CustomField: Codable, Identifiable, Equatable {
    var id: UUID
    var label: String
    var value: String

    init(id: UUID = UUID(), label: String = "", value: String = "") {
        self.id = id
        self.label = label
        self.value = value
    }
}

struct AutofillProfile: Codable, Identifiable, Equatable {
    var id: UUID
    var name: String
    // Personal
    var fullName: String
    var givenName: String
    var familyName: String
    var emailAddress: String
    var phoneNumber: String
    // Address
    var streetAddress: String
    var city: String
    var state: String
    var postalCode: String
    var countryCode: String
    // Account
    var username: String
    var password: String
    // Identity
    var nationalID: String
    var passportNumber: String
    // Payment
    var creditCardNumber: String
    var creditCardExpiry: String
    // User-defined extras
    var customFields: [CustomField]

    init(
        id: UUID = UUID(),
        name: String = "",
        fullName: String = "",
        givenName: String = "",
        familyName: String = "",
        emailAddress: String = "",
        phoneNumber: String = "",
        streetAddress: String = "",
        city: String = "",
        state: String = "",
        postalCode: String = "",
        countryCode: String = "",
        username: String = "",
        password: String = "",
        nationalID: String = "",
        passportNumber: String = "",
        creditCardNumber: String = "",
        creditCardExpiry: String = "",
        customFields: [CustomField] = []
    ) {
        self.id = id
        self.name = name
        self.fullName = fullName
        self.givenName = givenName
        self.familyName = familyName
        self.emailAddress = emailAddress
        self.phoneNumber = phoneNumber
        self.streetAddress = streetAddress
        self.city = city
        self.state = state
        self.postalCode = postalCode
        self.countryCode = countryCode
        self.username = username
        self.password = password
        self.nationalID = nationalID
        self.passportNumber = passportNumber
        self.creditCardNumber = creditCardNumber
        self.creditCardExpiry = creditCardExpiry
        self.customFields = customFields
    }

    static var empty: AutofillProfile { AutofillProfile() }
}
