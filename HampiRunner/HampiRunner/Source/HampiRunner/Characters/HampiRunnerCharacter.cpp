#include "Characters/HampiRunnerCharacter.h"
#include "GameFramework/CharacterMovementComponent.h"
#include "Components/CapsuleComponent.h"
#include "DrawDebugHelpers.h"

AHampiRunnerCharacter::AHampiRunnerCharacter()
{
	PrimaryActorTick.bCanEverTick = true;

	auto* Move = GetCharacterMovement();
	Move->GravityScale = GravityScaleAir;
	Move->AirControl = 0.6f;
	Move->BrakingFrictionFactor = 0.5f;
}

void AHampiRunnerCharacter::BeginPlay()
{
	Super::BeginPlay();
	Stamina = MaxStamina;
}

void AHampiRunnerCharacter::SetupPlayerInputComponent(UInputComponent* IC)
{
	IC->BindAxis("MoveForward", this, &AHampiRunnerCharacter::MoveForward);
	IC->BindAxis("MoveRight", this, &AHampiRunnerCharacter::MoveRight);
	IC->BindAxis("LookUp", this, &AHampiRunnerCharacter::LookUp);
	IC->BindAxis("Turn", this, &AHampiRunnerCharacter::Turn);

	IC->BindAction("Jump", IE_Pressed, this, &AHampiRunnerCharacter::JumpPressed);
	IC->BindAction("Jump", IE_Released, this, &AHampiRunnerCharacter::JumpReleased);
	IC->BindAction("Crouch", IE_Pressed, this, &AHampiRunnerCharacter::CrouchPressed);
	IC->BindAction("Sprint", IE_Pressed, this, &AHampiRunnerCharacter::SprintPressed);
	IC->BindAction("Sprint", IE_Released, this, &AHampiRunnerCharacter::SprintReleased);
}

void AHampiRunnerCharacter::Tick(float DeltaSeconds)
{
	Super::Tick(DeltaSeconds);

	if (JumpBufferTimer > 0.f)
		JumpBufferTimer -= DeltaSeconds;

	UpdateStamina(DeltaSeconds);
	UpdateMovementState(DeltaSeconds);
	UpdateCamera(DeltaSeconds);
}

/** Input */
void AHampiRunnerCharacter::MoveForward(float Value)
{
	if (Controller && Value != 0.f)
	{
		const FRotator YawRot(0.f, Controller->GetControlRotation().Yaw, 0.f);
		const FVector Dir = FRotationMatrix(YawRot).GetUnitAxis(EAxis::X);
		AddMovementInput(Dir, Value);
	}
}

void AHampiRunnerCharacter::MoveRight(float Value)
{
	if (Controller && Value != 0.f)
	{
		const FRotator YawRot(0.f, Controller->GetControlRotation().Yaw, 0.f);
		const FVector Dir = FRotationMatrix(YawRot).GetUnitAxis(EAxis::Y);
		AddMovementInput(Dir, Value);
	}
}

void AHampiRunnerCharacter::LookUp(float Value)  { AddControllerPitchInput(Value); }
void AHampiRunnerCharacter::Turn(float Value)    { AddControllerYawInput(Value); }

void AHampiRunnerCharacter::JumpPressed()
{
	bJumpHeld = true;
	JumpBufferTimer = JumpBufferTime;

	if (GetCharacterMovement()->IsMovingOnGround())
	{
		Jump();
		ParkourState = EParkourState::Airborne;
		JumpBufferTimer = 0.f;
	}
}

void AHampiRunnerCharacter::JumpReleased()
{
	bJumpHeld = false;
	StopJumping();
}

void AHampiRunnerCharacter::CrouchPressed()
{
	if (ParkourState == EParkourState::Grounded &&
		GetVelocity().Size2D() > 600.f)
	{
		ParkourState = EParkourState::Slide;
		GetCharacterMovement()->BrakingFrictionFactor = 0.f;
		Crouch();
	}
	else
	{
		Crouch();
	}
}

void AHampiRunnerCharacter::SprintPressed()  { bWantsToSprint = true; }
void AHampiRunnerCharacter::SprintReleased() { bWantsToSprint = false; }

/** State & stamina */
void AHampiRunnerCharacter::UpdateStamina(float Dt)
{
	float Drain = 0.f;

	if (bWantsToSprint && ParkourState == EParkourState::Grounded)
		Drain += SprintDrainPerSec;

	if (ParkourState == EParkourState::WallRun)
		Drain += WallRunDrainPerSec;

	Stamina = FMath::Clamp(Stamina - Drain * Dt, 0.f, MaxStamina);

	if (!bWantsToSprint && ParkourState == EParkourState::Grounded && GetVelocity().Size2D() < 200.f)
	{
		Stamina = FMath::Min(MaxStamina, Stamina + RegenPerSec * Dt);
	}
}

void AHampiRunnerCharacter::UpdateMovementState(float Dt)
{
	const bool bGrounded = GetCharacterMovement()->IsMovingOnGround();

	if (ParkourState == EParkourState::Grounded && !bGrounded)
		ParkourState = EParkourState::Airborne;

	if (ParkourState == EParkourState::Airborne && bGrounded)
		ParkourState = EParkourState::Grounded;

	switch (ParkourState)
	{
		case EParkourState::Grounded:  HandleGrounded(Dt);  break;
		case EParkourState::Airborne:  HandleAirborne(Dt);  break;
		case EParkourState::Slide:     HandleSlide(Dt);     break;
		case EParkourState::WallRun:   HandleWallRun(Dt);   break;
		case EParkourState::LedgeHang: HandleLedgeHang(Dt); break;
	}
}

void AHampiRunnerCharacter::HandleGrounded(float Dt)
{
	auto* Move = GetCharacterMovement();
	const bool bCanSprint = (Stamina > 10.f);
	const float TargetSpeed = (bWantsToSprint && bCanSprint) ? RunSpeed : WalkSpeed;
	Move->MaxWalkSpeed = TargetSpeed;

	// buffered jump
	if (JumpBufferTimer > 0.f && Move->IsMovingOnGround())
	{
		Jump();
		ParkourState = EParkourState::Airborne;
		JumpBufferTimer = 0.f;
	}
}

void AHampiRunnerCharacter::HandleAirborne(float Dt)
{
	// try to start wall‑run if near wall and moving forward
	FVector WallNormal;
	if (TraceForWall(WallNormal) && Stamina > 15.f && bWantsToSprint)
	{
		ParkourState = EParkourState::WallRun;
		GetCharacterMovement()->GravityScale = 0.6f;
		return;
	}

	// ledge grab when rising and near edge
	if (bJumpHeld)
	{
		FVector LedgeLoc, LedgeNorm;
		if (TraceForLedge(LedgeLoc, LedgeNorm))
		{
			ParkourState = EParkourState::LedgeHang;
			LedgeLocation = LedgeLoc;
			LedgeNormal = LedgeNorm;
			GetCharacterMovement()->StopMovementImmediately();
			SetActorLocation(LedgeLocation);
		}
	}
}

void AHampiRunnerCharacter::HandleSlide(float Dt)
{
	auto* Move = GetCharacterMovement();
	FVector Vel = Move->Velocity;

	if (Vel.Size2D() < 300.f)
	{
		UnCrouch();
		Move->BrakingFrictionFactor = 0.5f;
		ParkourState = EParkourState::Grounded;
		return;
	}

	// preserve horizontal momentum, let friction slow us
}

void AHampiRunnerCharacter::HandleWallRun(float Dt)
{
	auto* Move = GetCharacterMovement();
	FVector WallNormal;

	if (!TraceForWall(WallNormal) || Stamina <= 0.f)
	{
		Move->GravityScale = GravityScaleAir;
		ParkourState = EParkourState::Airborne;
		CameraRollTarget = 0.f;
		return;
	}

	FVector Forward = FVector::CrossProduct(WallNormal, FVector::UpVector);
	if (FVector::DotProduct(Forward, GetActorForwardVector()) < 0.f)
		Forward *= -1.f;

	FVector NewVel = Forward * WallRunSpeed;
	NewVel.Z = 0.f;
	Move->Velocity = NewVel;

	CameraRollTarget = 10.f * FMath::Sign(FVector::DotProduct(WallNormal, GetActorRightVector()));
}

void AHampiRunnerCharacter::HandleLedgeHang(float Dt)
{
	// simple: hold at ledge, let player decide:
	// W / Jump → climb up; S → drop
	// You can bind inputs to call small helper functions to change state.
}

bool AHampiRunnerCharacter::TraceForWall(FVector& OutWallNormal) const
{
	const FVector Start = GetActorLocation() + FVector(0,0,50);
	const FVector Fwd   = GetActorForwardVector();
	FHitResult Hit;

	if (GetWorld()->LineTraceSingleByChannel(Hit, Start, Start + Fwd * 75.f, ECC_Visibility))
	{
		OutWallNormal = Hit.Normal;
		return true;
	}

	return false;
}

bool AHampiRunnerCharacter::TraceForLedge(FVector& OutLoc, FVector& OutNorm) const
{
	const FVector Eye = GetActorLocation() + FVector(0,0,80);
	FHitResult ForwardHit;

	if (!GetWorld()->LineTraceSingleByChannel(ForwardHit, Eye, Eye + GetActorForwardVector() * 60.f, ECC_Visibility))
		return false;

	const FVector Top = ForwardHit.ImpactPoint + FVector(0,0,30) - GetActorForwardVector() * 10.f;
	FHitResult DownHit;

	if (GetWorld()->LineTraceSingleByChannel(DownHit, Top, Top - FVector(0,0,60), ECC_Visibility))
	{
		OutLoc = DownHit.ImpactPoint + FVector(0,0,-GetCapsuleComponent()->GetScaledCapsuleHalfHeight() + 5);
		OutNorm = ForwardHit.Normal;
		return true;
	}

	return false;
}

void AHampiRunnerCharacter::UpdateCamera(float Dt)
{
	if (APlayerController* PC = Cast<APlayerController>(GetController()))
	{
		FRotator ControlRot = PC->PlayerCameraManager->GetCameraRotation();
		float CurrentRoll = ControlRot.Roll;
		float NewRoll = FMath::FInterpTo(CurrentRoll, CameraRollTarget, Dt, 5.f);
		ControlRot.Roll = NewRoll;
		PC->SetControlRotation(ControlRot);
	}
}
