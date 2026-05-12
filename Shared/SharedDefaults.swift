import Foundation

final class SharedDefaults {
    static let shared = SharedDefaults()

    static let suiteName = "group.com.yourorg.AutofillKeyboard"

    private let defaults: UserDefaults?

    private init() {
        defaults = UserDefaults(suiteName: SharedDefaults.suiteName)
    }

    var isAvailable: Bool { defaults != nil }

    func setData(_ data: Data, forKey key: String) {
        defaults?.set(data, forKey: key)
    }

    func data(forKey key: String) -> Data? {
        defaults?.data(forKey: key)
    }

    func setString(_ string: String, forKey key: String) {
        defaults?.set(string, forKey: key)
    }

    func string(forKey key: String) -> String? {
        defaults?.string(forKey: key)
    }
}
