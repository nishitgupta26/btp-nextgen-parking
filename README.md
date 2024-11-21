# Next Generation Smart Parking Solution

Our solution, built using the MERN stack and Tailwind CSS, aims to solve two major real-life problems:

1. **Allow online and advanced booking of parking spaces**: This ensures that when you are going to any place, you do not worry about parking your vehicle.
2. **Increase the visibility of parking lots**: This results in profit maximization for parking lot owners.

Customers need to provide their location access to us, and we will show the nearby available parking lots sorted by nearest distance. To book a parking space online, users must first log in to our website, choose the desired parking lot, and book their parking.

## Stakeholders and Their Functionalities

We have divided the stakeholders of our website into four categories: Customers, Parking Lot Owners, Parking Lot Managers, and Website Admins. Below is the detailed description of the functionalities available to each stakeholder.

### Customer View

1. **Login/Sign Up**: Users can log in or sign up using email verification to ensure security and smooth functioning of our website.
2. **Location Access**: Utilize the Geolocation API for secure location access.
3. **Sorting**: Parking spaces are sorted based on the distance from the current location.
4. **Parking Spaces Options**: Parking spaces will be shown in the form of cards, each representing:
   - Parking Name
   - Parking Type
   - Location
   - Charging Enabled
   - Distance
   - Reserve (button)
5. **User Profile**: Users can edit details like Vehicle No., Name, password, etc.

### Admin View (Company Executives)

1. **Approve/Disapprove New Parking Space Requests**: Admins can approve or disapprove requests for new parking spaces.
2. **Remove Fraudulent Parking Spaces & Users**: Admins can remove fraudulent parking spaces and users from the system.

### Parking Owner Management Page

1. **Add Parking Space**: Parking owners can send a request to the admin to add a new parking space using the CREATE LISTING functionality.
2. **Manage Parking Spaces**: Parking owners can edit the details of their parking spaces.
3. **Add New Parking Manager**: Parking owners can add new parking managers.
4. **Open or Close the Parking Slot**: Parking owners can open or close the parking slot during holidays.

### Parking Manager Management Page

1. **Check Vehicle Entry**: The manager will check whether the vehicle’s entry is already present before entering the parking lot. If an entry is found, the vehicle is allowed to enter. If not, the user is asked to pay the amount.
2. **Check Dues Before Exit**: The manager will check whether the vehicle has any dues left before the vehicle leaves the parking lot.
