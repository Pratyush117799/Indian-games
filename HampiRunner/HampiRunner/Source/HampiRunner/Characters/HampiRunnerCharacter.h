#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "HampiRunnerCharacter.generated.h"

UENUM(BlueprintType)
enum class EParkourState : uint8
{
	Grounded,
	Airborne,
	Slide,
	WallRun,
	LedgeHang
};

UCLASS()
class HAMPIRUNNER_API AHampiRunnerCharacter : public ACharacter
{
	GENERATED_BODY()

public:
	AHampiRunnerCharacter();
	virtual void Tick(float DeltaSeconds) override;
	virtual void SetupPlayerInputComponent(class UInputComponent* PlayerInputComponent) override;

protected:
	virtual void BeginPlay() override;

	/** Input */
	void MoveForward(float Value);
	void MoveRight(float Value);
	void LookUp(float Value);
	void Turn(float Value);
	void JumpPressed();
	void JumpReleased();
	void CrouchPressed();
	void SprintPressed();
	void SprintReleased();

	/** State update */
	void UpdateMovementState(float DeltaSeconds);
	void HandleGrounded(float DeltaSeconds);
	void HandleAirborne(float DeltaSeconds);
	void HandleSlide(float DeltaSeconds);
	void HandleWallRun(float DeltaSeconds);
	void HandleLedgeHang(float DeltaSeconds);

	bool TraceForLedge(FVector& OutLedgeLoc, FVector& OutLedgeNormal) const;
	bool TraceForWall(FVector& OutWallNormal) const;

	void UpdateStamina(float DeltaSeconds);
	void UpdateCamera(float DeltaSeconds);

protected:
	UPROPERTY(EditDefaultsOnly, Category="Movement")
	float WalkSpeed = 450.f;

	UPROPERTY(EditDefaultsOnly, Category="Movement")
	float RunSpeed = 800.f;

	UPROPERTY(EditDefaultsOnly, Category="Movement")
	float SlideSpeed = 1100.f;

	UPROPERTY(EditDefaultsOnly, Category="Movement")
	float WallRunSpeed = 900.f;

	UPROPERTY(EditDefaultsOnly, Category="Movement")
	float GravityScaleAir = 2.2f;

	UPROPERTY(EditDefaultsOnly, Category="Stamina")
	float MaxStamina = 100.f;

	UPROPERTY(VisibleInstanceOnly, Category="Stamina")
	float Stamina = 100.f;

	UPROPERTY(EditDefaultsOnly, Category="Stamina")
	float SprintDrainPerSec = 12.f;

	UPROPERTY(EditDefaultsOnly, Category="Stamina")
	float WallRunDrainPerSec = 18.f;

	UPROPERTY(EditDefaultsOnly, Category="Stamina")
	float RegenPerSec = 15.f;

	UPROPERTY(VisibleInstanceOnly, Category="State")
	EParkourState ParkourState = EParkourState::Grounded;

	bool bWantsToSprint = false;
	bool bJumpHeld = false;

	/** Jump input buffering */
	float JumpBufferTime = 0.15f;
	float JumpBufferTimer = 0.f;

	/** Ledge hang data */
	FVector LedgeLocation;
	FVector LedgeNormal;

	/** Camera tilt for wall run */
	float CameraRollTarget = 0.f;
};
