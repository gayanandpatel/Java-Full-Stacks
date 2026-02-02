import PropTypes from "prop-types";
import { FaCheck, FaTimes } from "react-icons/fa";
import styles from "./AddressForm.module.css";

const COUNTRY_OPTIONS = [
  { code: "IN", name: "India" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "CN", name: "China" },
  { code: "BR", name: "Brazil" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "MX", name: "Mexico" },
  { code: "RU", name: "Russia" },
  { code: "ZA", name: "South Africa" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SG", name: "Singapore" },
];

const AddressForm = ({
  address = {},
  onChange,
  onSubmit,
  isEditing = false,
  onCancel,
  showButtons = true,
  showCheck = true,
  showTitle = true,
  showAddressType = true,
}) => {
  return (
    <div className={styles.formContainer}>
      {showTitle && (
        <h5 className={styles.title}>
          {isEditing ? "Edit Address" : "Add New Address"}
        </h5>
      )}

      {/* Street & City */}
      <div className={styles.row}>
        <div className={styles.col}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Street Address</label>
            <input
              type="text"
              name="street"
              className={styles.input}
              placeholder="123 Main St"
              value={address.street || ""}
              onChange={onChange}
            />
          </div>
        </div>
        <div className={styles.col}>
          <div className={styles.formGroup}>
            <label className={styles.label}>City</label>
            <input
              type="text"
              name="city"
              className={styles.input}
              placeholder="City"
              value={address.city || ""}
              onChange={onChange}
            />
          </div>
        </div>
      </div>

      {/* State & Postal Code */}
      <div className={styles.row}>
        <div className={styles.col}>
          <div className={styles.formGroup}>
            <label className={styles.label}>State / Province</label>
            <input
              type="text"
              name="state"
              className={styles.input}
              placeholder="State"
              value={address.state || ""}
              onChange={onChange}
            />
          </div>
        </div>
        <div className={styles.col}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Postal Code</label>
            <input
              type="text"
              name="postalCode"
              className={styles.input}
              placeholder="Zip/Postal Code"
              value={address.postalCode || ""}
              onChange={onChange}
            />
          </div>
        </div>
      </div>

      {/* Country & Phone */}
      <div className={styles.row}>
        <div className={styles.col}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Country</label>
            <select
              name="country"
              className={styles.select}
              value={address.country || ""}
              onChange={onChange}
            >
              <option value="">Select Country...</option>
              {COUNTRY_OPTIONS.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.col}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Phone Number</label>
            <input
              type="text"
              name="mobileNumber"
              className={styles.input}
              placeholder="+1 (555) 000-0000"
              value={address.mobileNumber || ""}
              onChange={onChange}
            />
          </div>
        </div>
      </div>

      {/* Address Type (Conditional) */}
      {showAddressType && (
        <div className={styles.formGroup}>
          <label className={styles.label}>Address Type</label>
          <select
            name="addressType"
            className={styles.select}
            value={address.addressType || ""}
            onChange={onChange}
          >
            <option value="">Select Type</option>
            <option value="HOME">Home</option>
            <option value="OFFICE">Office</option>
            <option value="SHIPPING">Shipping</option>
          </select>
        </div>
      )}

      {/* Action Buttons */}
      {showButtons && (
        <div className={styles.actionButtons}>
          {showCheck && (
            <button
              onClick={onSubmit}
              className={`${styles.iconBtn} ${styles.saveBtn}`}
              title={isEditing ? "Update Address" : "Add Address"}
              type="button"
            >
              <FaCheck />
            </button>
          )}

          <button
            onClick={onCancel}
            className={`${styles.iconBtn} ${styles.cancelBtn}`}
            title="Cancel"
            type="button"
          >
            <FaTimes />
          </button>
        </div>
      )}
    </div>
  );
};

// Define Prop Types for Safety
AddressForm.propTypes = {
  address: PropTypes.shape({
    street: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    postalCode: PropTypes.string,
    country: PropTypes.string,
    mobileNumber: PropTypes.string,
    addressType: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  isEditing: PropTypes.bool,
  onCancel: PropTypes.func,
  showButtons: PropTypes.bool,
  showCheck: PropTypes.bool,
  showTitle: PropTypes.bool,
  showAddressType: PropTypes.bool,
};

export default AddressForm;