import UIKit

struct LabelDetector {

    /// Detects the semantic field type of the currently focused text field.
    ///
    /// Detection order (label-reading is primary — most forms don't set textContentType):
    /// 1. Read documentContextBeforeInput and keyword-match Arabic/English label text
    /// 2. Match a custom field label from the active profile
    /// 3. UITextContentType (set by developer — reliable but rare)
    /// 4. UIKeyboardType heuristic
    func detectFieldType(
        proxy: UITextDocumentProxy,
        contentType: UITextContentType?,
        keyboardType: UIKeyboardType,
        customFieldLabels: [String]
    ) -> FieldType {

        // Step 1 + 2: label text from surrounding context
        if let context = proxy.documentContextBeforeInput, !context.isEmpty {
            if let type = detect(from: context, customFieldLabels: customFieldLabels) {
                return type
            }
        }

        // Step 3: UITextContentType
        if let contentType {
            let mapped = map(contentType: contentType)
            if mapped != .unknown { return mapped }
        }

        // Step 4: keyboard type heuristic
        return map(keyboardType: keyboardType)
    }

    // MARK: - Private

    private func detect(from context: String, customFieldLabels: [String]) -> FieldType? {
        // Focus on the last ~100 characters — label is typically right before the field
        let tail = String(context.suffix(100))

        // Split into lines; check from the most recent line backward
        let lines = tail.components(separatedBy: CharacterSet.newlines)
        for line in lines.reversed() {
            let trimmed = line.trimmingCharacters(in: .whitespacesAndNewlines)
            guard !trimmed.isEmpty else { continue }

            // Try whole line first
            let lineType = KeywordDictionary.fieldType(for: trimmed)
            if lineType != .unknown { return lineType }

            // Try matching against user-defined custom field labels
            if let custom = matchCustom(text: trimmed, labels: customFieldLabels) {
                return custom
            }

            // Try individual words
            let words = trimmed.components(separatedBy: CharacterSet(charactersIn: " :،,"))
            for word in words.reversed() {
                let w = word.trimmingCharacters(in: .whitespacesAndNewlines)
                guard w.count > 2 else { continue }
                let wType = KeywordDictionary.fieldType(for: w)
                if wType != .unknown { return wType }
                if let custom = matchCustom(text: w, labels: customFieldLabels) {
                    return custom
                }
            }
        }
        return nil
    }

    private func matchCustom(text: String, labels: [String]) -> FieldType? {
        let lower = text.lowercased()
        for label in labels {
            if label.lowercased() == lower || lower.contains(label.lowercased()) || label.lowercased().contains(lower) {
                return .custom(label: label)
            }
        }
        return nil
    }

    private func map(contentType: UITextContentType) -> FieldType {
        switch contentType {
        case .name:                                     return .fullName
        case .givenName:                                return .givenName
        case .familyName:                               return .familyName
        case .emailAddress:                             return .email
        case .telephoneNumber:                          return .phone
        case .streetAddressLine1,
             .streetAddressLine2,
             .fullStreetAddress:                        return .streetAddress
        case .addressCity:                              return .city
        case .addressState:                             return .state
        case .postalCode:                               return .postalCode
        case .countryName:                              return .country
        case .username, .nickname:                      return .username
        case .password, .newPassword:                   return .password
        case .creditCardNumber:                         return .creditCardNumber
        default:                                        return .unknown
        }
    }

    private func map(keyboardType: UIKeyboardType) -> FieldType {
        switch keyboardType {
        case .emailAddress:                             return .email
        case .phonePad, .namePhonePad:                  return .phone
        default:                                        return .unknown
        }
    }
}
