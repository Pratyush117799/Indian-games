using UnityEngine;
using System.Collections.Generic;

public class RathaController : MonoBehaviour
{
    [Header("Chariot Settings")]
    public float maxSpeed = 15f;
    public float acceleration = 5f;
    public float turnSpeed = 50f;
    public Transform centerOfMass;
    public Rigidbody chariotRb;

    [Header("Horse Connections")]
    public List<HorseController> horses;
    public Transform[] hitchPoints;

    [Header("Camera Settings")]
    public Transform cameraTarget;
    public float cameraSmoothSpeed = 0.125f;
    public Vector3 cameraOffset = new Vector3(0, 5, -10);
    
    [Header("Input")]
    public float inputHorizontal;
    public float inputVertical;

    private void Start()
    {
        if (chariotRb == null) chariotRb = GetComponent<Rigidbody>();
        if (chariotRb != null && centerOfMass != null)
        {
            chariotRb.centerOfMass = centerOfMass.localPosition;
        }
    }

    private void Update()
    {
        HandleInput();
        UpdateCamera();
    }

    private void FixedUpdate()
    {
        MoveChariot();
        ControlHorses();
    }

    private void HandleInput()
    {
        if (InputManager.Instance != null)
        {
            inputHorizontal = InputManager.Instance.horizontal;
            inputVertical = InputManager.Instance.vertical;
        }
        else
        {
            // Fallback if InputManager is missing
            inputHorizontal = Input.GetAxis("Horizontal");
            inputVertical = Input.GetAxis("Vertical");
        }
    }

    private void MoveChariot()
    {
        if (chariotRb == null) return;

        // Basic physics movement for the chariot
        // In a real scenario, this would be forces applied by the horses
        // For simulation, we apply force based on "horse power"
        
        float currentSpeed = chariotRb.velocity.magnitude;
        
        // Forward movement
        if (inputVertical > 0.1f)
        {
            Vector3 force = transform.forward * inputVertical * acceleration * horses.Count; 
            chariotRb.AddForce(force);
        }

        // Turning
        if (currentSpeed > 0.5f)
        {
            float turn = inputHorizontal * turnSpeed * Time.fixedDeltaTime;
            Quaternion turnRotation = Quaternion.Euler(0f, turn, 0f);
            chariotRb.MoveRotation(chariotRb.rotation * turnRotation);
        }
    }

    private void ControlHorses()
    {
        foreach (var horse in horses)
        {
            if (horse != null)
            {
                horse.SetInput(inputVertical, inputHorizontal);
            }
        }
    }

    private void UpdateCamera()
    {
        if (Camera.main != null && cameraTarget != null)
        {
            Vector3 desiredPosition = cameraTarget.position + (transform.rotation * cameraOffset);
            Vector3 smoothedPosition = Vector3.Lerp(Camera.main.transform.position, desiredPosition, cameraSmoothSpeed);
            Camera.main.transform.position = smoothedPosition;
            Camera.main.transform.LookAt(cameraTarget);
        }
    }
}
