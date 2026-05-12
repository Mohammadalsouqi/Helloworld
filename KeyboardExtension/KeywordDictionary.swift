import Foundation

enum FieldType: Equatable {
    case fullName, givenName, familyName
    case email, phone
    case streetAddress, city, state, postalCode, country
    case username, password
    case nationalID, passportNumber
    case creditCardNumber, creditCardExpiry
    case custom(label: String)
    case unknown
}

struct KeywordDictionary {

    // Maps lowercase keyword → FieldType.
    // Longer/more-specific phrases are checked before single words via the
    // sorted search in fieldType(for:).
    static let keywords: [(keyword: String, type: FieldType)] = [
        // ── English – Name ──────────────────────────────────────────────────
        ("full name",        .fullName),
        ("fullname",         .fullName),
        ("complete name",    .fullName),
        ("your name",        .fullName),
        ("name",             .fullName),
        ("first name",       .givenName),
        ("firstname",        .givenName),
        ("given name",       .givenName),
        ("forename",         .givenName),
        ("last name",        .familyName),
        ("lastname",         .familyName),
        ("family name",      .familyName),
        ("surname",          .familyName),
        // ── English – Email ──────────────────────────────────────────────────
        ("email address",    .email),
        ("e-mail address",   .email),
        ("email",            .email),
        ("e-mail",           .email),
        // ── English – Phone ──────────────────────────────────────────────────
        ("phone number",     .phone),
        ("mobile number",    .phone),
        ("telephone number", .phone),
        ("phone",            .phone),
        ("mobile",           .phone),
        ("telephone",        .phone),
        ("cell",             .phone),
        // ── English – Address ────────────────────────────────────────────────
        ("street address",   .streetAddress),
        ("street",           .streetAddress),
        ("address",          .streetAddress),
        ("city",             .city),
        ("town",             .city),
        ("state",            .state),
        ("province",         .state),
        ("region",           .state),
        ("postal code",      .postalCode),
        ("zip code",         .postalCode),
        ("postcode",         .postalCode),
        ("postal",           .postalCode),
        ("zip",              .postalCode),
        ("country",          .country),
        ("nation",           .country),
        // ── English – Account ────────────────────────────────────────────────
        ("user name",        .username),
        ("username",         .username),
        ("login",            .username),
        ("password",         .password),
        ("passcode",         .password),
        ("pass",             .password),
        ("pin",              .password),
        // ── English – Identity ───────────────────────────────────────────────
        ("national id",      .nationalID),
        ("national number",  .nationalID),
        ("national identification", .nationalID),
        ("id number",        .nationalID),
        ("identity number",  .nationalID),
        ("civil id",         .nationalID),
        ("passport number",  .passportNumber),
        ("passport no",      .passportNumber),
        ("passport",         .passportNumber),
        // ── English – Payment ────────────────────────────────────────────────
        ("credit card number", .creditCardNumber),
        ("card number",      .creditCardNumber),
        ("credit card",      .creditCardNumber),
        ("card no",          .creditCardNumber),
        ("expiry date",      .creditCardExpiry),
        ("expiration date",  .creditCardExpiry),
        ("expiry",           .creditCardExpiry),
        ("expiration",       .creditCardExpiry),
        ("exp date",         .creditCardExpiry),
        ("valid thru",       .creditCardExpiry),
        ("valid through",    .creditCardExpiry),

        // ── Arabic – Name ────────────────────────────────────────────────────
        ("الاسم الكامل",    .fullName),
        ("الاسم بالكامل",  .fullName),
        ("اسمك الكامل",    .fullName),
        ("الاسم",           .fullName),
        ("اسمك",            .fullName),
        ("الاسم الأول",    .givenName),
        ("الاسم الاول",    .givenName),
        ("اسم العائلة",    .familyName),
        ("اسم الاسرة",     .familyName),
        ("اللقب",           .familyName),
        // ── Arabic – Email ───────────────────────────────────────────────────
        ("البريد الإلكتروني", .email),
        ("البريد الالكتروني", .email),
        ("البريد",          .email),
        ("الإيميل",         .email),
        ("الايميل",         .email),
        ("ايميل",           .email),
        ("إيميل",           .email),
        // ── Arabic – Phone ───────────────────────────────────────────────────
        ("رقم الهاتف",     .phone),
        ("رقم الجوال",     .phone),
        ("رقم الموبايل",   .phone),
        ("الهاتف المحمول", .phone),
        ("الهاتف",          .phone),
        ("الجوال",          .phone),
        ("الموبايل",        .phone),
        ("موبايل",          .phone),
        // ── Arabic – Address ─────────────────────────────────────────────────
        ("العنوان البريدي", .streetAddress),
        ("العنوان",         .streetAddress),
        ("الشارع",          .streetAddress),
        ("المدينة",         .city),
        ("المحافظة",        .state),
        ("الولاية",         .state),
        ("المنطقة",         .state),
        ("الرمز البريدي",  .postalCode),
        ("الكود البريدي",  .postalCode),
        ("الدولة",          .country),
        ("البلد",           .country),
        // ── Arabic – Account ─────────────────────────────────────────────────
        ("اسم المستخدم",   .username),
        ("اسم المستعمل",   .username),
        ("المستخدم",        .username),
        ("كلمة المرور",    .password),
        ("كلمة السر",      .password),
        ("الرقم السري",    .password),
        ("رمز المرور",     .password),
        // ── Arabic – Identity ────────────────────────────────────────────────
        ("رقم الهوية الوطنية", .nationalID),
        ("رقم الهوية",     .nationalID),
        ("الهوية الوطنية", .nationalID),
        ("الهوية",          .nationalID),
        ("رقم الهوية الشخصية", .nationalID),
        ("رقم جواز السفر", .passportNumber),
        ("جواز السفر",     .passportNumber),
        ("الجواز",          .passportNumber),
        // ── Arabic – Payment ─────────────────────────────────────────────────
        ("رقم بطاقة الائتمان", .creditCardNumber),
        ("بطاقة الائتمان", .creditCardNumber),
        ("رقم البطاقة",    .creditCardNumber),
        ("رقم الكارت",     .creditCardNumber),
        ("تاريخ انتهاء الصلاحية", .creditCardExpiry),
        ("تاريخ الانتهاء", .creditCardExpiry),
        ("انتهاء الصلاحية", .creditCardExpiry),
        ("صالح حتى",       .creditCardExpiry),
    ]

    /// Returns the best FieldType match for the given text.
    /// Checks longer phrases first to avoid partial false-positives.
    static func fieldType(for text: String) -> FieldType {
        let lower = text.lowercased().trimmingCharacters(in: .whitespacesAndNewlines)
        guard !lower.isEmpty else { return .unknown }
        // Sort by keyword length descending so "full name" beats "name"
        let sorted = keywords.sorted { $0.keyword.count > $1.keyword.count }
        for (keyword, type) in sorted {
            if lower == keyword || lower.contains(keyword) {
                return type
            }
        }
        return .unknown
    }
}
