#include "Missions/MissionManager.h"

AMissionManager::AMissionManager()
{
	PrimaryActorTick.bCanEverTick = true;
}

void AMissionManager::BeginPlay()
{
	Super::BeginPlay();
}

void AMissionManager::Tick(float DeltaSeconds)
{
	Super::Tick(DeltaSeconds);

	if (CurrentMission && CurrentStageIndex != INDEX_NONE)
	{
		auto& Stage = CurrentMission->Stages[CurrentStageIndex];
		if (Stage.TimeLimitSeconds > 0.f)
		{
			StageTimeRemaining -= DeltaSeconds;
			if (StageTimeRemaining <= 0.f)
			{
				FailMission();
			}
		}
	}
}

void AMissionManager::StartMission(UMissionDef* Mission)
{
	if (!Mission) return;

	CurrentMission = Mission;
	CurrentStageIndex = Mission->Stages.Num() > 0 ? 0 : INDEX_NONE;

	if (CurrentStageIndex != INDEX_NONE)
	{
		StageTimeRemaining = Mission->Stages[0].TimeLimitSeconds;
		OnMissionStarted.Broadcast(CurrentMission, Mission->Stages[0]);
		OnStageChanged.Broadcast(CurrentMission, Mission->Stages[0]);
	}
}

void AMissionManager::CompleteCurrentStage()
{
	if (!CurrentMission || CurrentStageIndex == INDEX_NONE) return;

	++CurrentStageIndex;

	if (CurrentStageIndex >= CurrentMission->Stages.Num())
	{
		// Mission complete – you can broadcast another delegate or trigger narrative here
		CurrentMission = nullptr;
		CurrentStageIndex = INDEX_NONE;
		StageTimeRemaining = 0.f;
		return;
	}

	auto& Stage = CurrentMission->Stages[CurrentStageIndex];
	StageTimeRemaining = Stage.TimeLimitSeconds;
	OnStageChanged.Broadcast(CurrentMission, Stage);
}

void AMissionManager::FailMission()
{
	// Simple reset for now
	CurrentMission = nullptr;
	CurrentStageIndex = INDEX_NONE;
	StageTimeRemaining = 0.f;
}
