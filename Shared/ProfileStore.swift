import Foundation

final class ProfileStore {
    static let shared = ProfileStore()

    private let profilesKey = "profiles"
    private let activeProfileIDKey = "active_profile_id"
    private let encoder = JSONEncoder()
    private let decoder = JSONDecoder()

    private init() {}

    func loadProfiles() -> [AutofillProfile] {
        guard let data = SharedDefaults.shared.data(forKey: profilesKey) else { return [] }
        return (try? decoder.decode([AutofillProfile].self, from: data)) ?? []
    }

    func saveProfiles(_ profiles: [AutofillProfile]) {
        guard let data = try? encoder.encode(profiles) else { return }
        SharedDefaults.shared.setData(data, forKey: profilesKey)
    }

    func activeProfile() -> AutofillProfile? {
        let profiles = loadProfiles()
        guard let idString = SharedDefaults.shared.string(forKey: activeProfileIDKey),
              let id = UUID(uuidString: idString) else {
            return profiles.first
        }
        return profiles.first { $0.id == id } ?? profiles.first
    }

    func setActiveProfile(id: UUID) {
        SharedDefaults.shared.setString(id.uuidString, forKey: activeProfileIDKey)
    }

    func upsert(_ profile: AutofillProfile) {
        var profiles = loadProfiles()
        if let idx = profiles.firstIndex(where: { $0.id == profile.id }) {
            profiles[idx] = profile
        } else {
            profiles.append(profile)
        }
        saveProfiles(profiles)
    }

    func delete(id: UUID) {
        var profiles = loadProfiles()
        profiles.removeAll { $0.id == id }
        saveProfiles(profiles)
    }
}
