import Foundation

struct SuggestionChip {
    let displayText: String
    let insertionText: String
    let isMasked: Bool

    init(_ text: String, masked: Bool = false) {
        insertionText = text
        isMasked = masked
        if masked {
            displayText = String(repeating: "•", count: min(text.count, 10))
        } else {
            displayText = text
        }
    }
}

struct AutofillProvider {
    private let profile: AutofillProfile?

    /// Re-initialize on each viewWillAppear to pick up profile edits.
    init() {
        profile = ProfileStore.shared.activeProfile()
    }

    var customFieldLabels: [String] {
        profile?.customFields.map { $0.label } ?? []
    }

    func suggestions(for fieldType: FieldType) -> [SuggestionChip] {
        guard let p = profile else { return [] }

        switch fieldType {
        case .fullName:
            var chips: [SuggestionChip] = []
            if !p.fullName.isEmpty { chips.append(.init(p.fullName)) }
            let parts = [p.givenName, p.familyName].filter { !$0.isEmpty }.joined(separator: " ")
            if !parts.isEmpty && parts != p.fullName { chips.append(.init(parts)) }
            return chips

        case .givenName:    return chip(p.givenName)
        case .familyName:   return chip(p.familyName)
        case .email:        return chip(p.emailAddress)
        case .phone:        return chip(p.phoneNumber)
        case .streetAddress: return chip(p.streetAddress)
        case .city:         return chip(p.city)
        case .state:        return chip(p.state)
        case .postalCode:   return chip(p.postalCode)
        case .country:      return chip(p.countryCode)
        case .username:     return chip(p.username)

        case .password:
            guard !p.password.isEmpty else { return [] }
            return [.init(p.password, masked: true)]

        case .nationalID:   return chip(p.nationalID)
        case .passportNumber: return chip(p.passportNumber)

        case .creditCardNumber:
            guard !p.creditCardNumber.isEmpty else { return [] }
            return [.init(p.creditCardNumber, masked: true)]

        case .creditCardExpiry: return chip(p.creditCardExpiry)

        case .custom(let label):
            if let match = p.customFields.first(where: { $0.label.lowercased() == label.lowercased() }),
               !match.value.isEmpty {
                return [.init(match.value)]
            }
            return []

        case .unknown:
            return []
        }
    }

    private func chip(_ value: String) -> [SuggestionChip] {
        value.isEmpty ? [] : [.init(value)]
    }
}
