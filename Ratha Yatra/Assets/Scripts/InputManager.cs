using UnityEngine;

public class InputManager : MonoBehaviour
{
    public static InputManager Instance;

    [Header("Input Settings")]
    public float horizontal;
    public float vertical;
    public bool isSprinting;
    public bool isJumping;
    public bool isInteracting;

    private void Awake()
    {
        if (Instance == null) Instance = this;
        else Destroy(gameObject);

        DontDestroyOnLoad(gameObject);
    }

    private void Update()
    {
        if (GameManager.Instance != null && GameManager.Instance.CurrentState != GameState.Playing)
        {
            ResetInput();
            return;
        }

        HandleInput();
    }

    private void HandleInput()
    {
        horizontal = Input.GetAxis("Horizontal");
        vertical = Input.GetAxis("Vertical");
        isSprinting = Input.GetKey(KeyCode.LeftShift);
        isJumping = Input.GetButtonDown("Jump");
        isInteracting = Input.GetKeyDown(KeyCode.E);

        if (Input.GetKeyDown(KeyCode.Escape))
        {
            GameManager.Instance.TogglePause();
        }
    }

    private void ResetInput()
    {
        horizontal = 0;
        vertical = 0;
        isSprinting = false;
        isJumping = false;
        isInteracting = false;
    }
}
