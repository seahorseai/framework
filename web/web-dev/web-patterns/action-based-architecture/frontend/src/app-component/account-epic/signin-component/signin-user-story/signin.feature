Feature: Signin
  As a user
  I want to be able to sign in to the application
  So that I can create my personal account

  Rule: email: string is not empty with email format
  Rule: name: string is not empty 
  Rule: password: The password has to be alphanumeric with this format: al2*Ap34.
  Rule: confirmPassword: The confirmPassword has to be equal to password
  
  Scenario: The user does not exist in database
    Given a user on the SigninFormComponent
    When The user enters "pepe@gmail.com", "Pepe", "al2*Ap34", "al2*Ap34"
    And the user clicks the signin button
    Then the frontend sends the SigninRequest DTO to the backend
    Then the backend check the "pepe@gmail.com" does not exist in database
    Then UserAccount is created in the database
    Then the backend response with this code status: "201" 
    Then the frontend shows the LoginFormComponent

  Scenario: The user exists in database
    Given a user on the SigninFormComponent
    When The user enters "pepe@gmail.com", "Pepe", "al2*Ap34", "al2*Ap34"
    And the user clicks the signin button
    Then the front-end layer sends the UserRequest DTO to the back-end layer 
    Then the back-end layer check that "pepe@gmail.com" exist in database
    Then the backend layer response with this status code: "409" and this DTO: "{'error': 'User with email pepe@gmail.com already exists'}"
    Then the frontend shows this message: "User with email pepe@gmail.com already exists"
    
  Scenario: User fills wrong the signin form
    Given a user on the SigninFormComponent
    When The user enters "", "invalid-email", "", "12345"
    And the user clicks the signin button
    Then the frontend shows a message for each incorrect field
      
 