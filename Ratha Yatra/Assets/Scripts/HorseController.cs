using UnityEngine;

public class HorseController : MonoBehaviour
{
    [Header("Horse Stats")]
    public float maxStamina = 100f;
    public float currentStamina;
    public float staminaRecoveryRate = 5f;
    public float staminaDrainRate = 10f;
    public float minRunStamina = 10f;

    [Header("Movement")]
    public float speedMultiplier = 1f;
    public Animator animator;

    private float currentSpeed;
    private float targetSpeed;

    private void Start()
    {
        currentStamina = maxStamina;
        if (animator == null) animator = GetComponent<Animator>();
    }

    private void Update()
    {
        ManageStamina();
        UpdateAnimations();
    }

    public void SetInput(float forward, float turn)
    {
        // Simple state logic based on drive input
        if (forward > 0)
        {
            if (currentStamina > minRunStamina)
            {
                targetSpeed = forward; 
            }
            else
            {
                targetSpeed = Mathf.Clamp(forward, 0, 0.5f); // Forced slow down
            }
        }
        else
        {
            targetSpeed = 0;
        }

        // Smooth speed transition
        currentSpeed = Mathf.Lerp(currentSpeed, targetSpeed, Time.deltaTime * 5f);
        
        // Turn animation or local rotation could be handled here
        // transform.localRotation = Quaternion.Euler(0, turn * 30f, 0); 
    }

    private void ManageStamina()
    {
        if (currentSpeed > 0.6f) // Galloping/Fast Trot
        {
            currentStamina -= staminaDrainRate * Time.deltaTime;
        }
        else if (currentSpeed < 0.1f) // Idle
        {
            currentStamina += staminaRecoveryRate * Time.deltaTime;
        }

        currentStamina = Mathf.Clamp(currentStamina, 0, maxStamina);
    }

    private void UpdateAnimations()
    {
        if (animator != null)
        {
            animator.SetFloat("Speed", currentSpeed);
            // Additional triggers for jump, rear up, etc.
        }
    }
}
